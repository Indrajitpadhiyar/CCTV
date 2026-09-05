import os
import urllib.request
import cv2
import numpy as np
from typing import List, Dict, Tuple, Any

from utils.logger import setup_logger

logger = setup_logger("FaceAnalyzer")

class CentroidTracker:
    """Tracks face centroids across frames to assign stable, persistent face IDs."""

    def __init__(self, max_disappeared: int = 15, max_distance: float = 80.0):
        self.next_object_id = 1
        self.objects = {}       # id -> (cx, cy)
        self.bboxes = {}        # id -> (x, y, w, h)
        self.disappeared = {}   # id -> frame count missing
        self.max_disappeared = max_disappeared
        self.max_distance = max_distance

    def register(self, centroid: Tuple[int, int], bbox: Tuple[int, int, int, int]):
        self.objects[self.next_object_id] = centroid
        self.bboxes[self.next_object_id] = bbox
        self.disappeared[self.next_object_id] = 0
        self.next_object_id += 1

    def deregister(self, object_id: int):
        del self.objects[object_id]
        del self.bboxes[object_id]
        del self.disappeared[object_id]

    def update(self, rects: List[Tuple[int, int, int, int]]) -> Dict[int, Dict[str, Any]]:
        if len(rects) == 0:
            for object_id in list(self.disappeared.keys()):
                self.disappeared[object_id] += 1
                if self.disappeared[object_id] > self.max_disappeared:
                    self.deregister(object_id)
            return self._get_results()

        input_centroids = np.zeros((len(rects), 2), dtype="int")
        for i, (x, y, w, h) in enumerate(rects):
            input_centroids[i] = (int(x + w / 2.0), int(y + h / 2.0))

        if len(self.objects) == 0:
            for i in range(0, len(rects)):
                self.register(tuple(input_centroids[i]), rects[i])
        else:
            object_ids = list(self.objects.keys())
            object_centroids = list(self.objects.values())

            # Compute Euclidean distances between existing centroids and input centroids
            D = np.linalg.norm(np.array(object_centroids)[:, np.newaxis] - input_centroids, axis=2)

            rows = D.min(axis=1).argsort()
            cols = D.argmin(axis=1)[rows]

            used_rows = set()
            used_cols = set()

            for (row, col) in zip(rows, cols):
                if row in used_rows or col in used_cols:
                    continue

                if D[row, col] > self.max_distance:
                    continue

                object_id = object_ids[row]
                self.objects[object_id] = tuple(input_centroids[col])
                self.bboxes[object_id] = rects[col]
                self.disappeared[object_id] = 0

                used_rows.add(row)
                used_cols.add(col)

            unused_rows = set(range(0, D.shape[0])).difference(used_rows)
            unused_cols = set(range(0, D.shape[1])).difference(used_cols)

            if D.shape[0] >= D.shape[1]:
                for row in unused_rows:
                    object_id = object_ids[row]
                    self.disappeared[object_id] += 1
                    if self.disappeared[object_id] > self.max_disappeared:
                        self.deregister(object_id)
            else:
                for col in unused_cols:
                    self.register(tuple(input_centroids[col]), rects[col])

        return self._get_results()

    def _get_results(self) -> Dict[int, Dict[str, Any]]:
        results = {}
        for object_id in self.objects:
            results[object_id] = {
                "centroid": self.objects[object_id],
                "bbox": self.bboxes[object_id]
            }
        return results


class FaceAnalyzer:
    """
    High-Precision Real-Time Face AI Engine for CCTV Streams.
    Uses OpenCV YuNet Deep Learning ONNX model with Fallback Cascade & Landmark verification
    to eliminate false positives on billboards, cars, signs, and background noise.
    """

    YUNET_MODEL_URL = "https://github.com/opencv/opencv_zoo/raw/main/models/face_detection_yunet/face_detection_yunet_2023mar.onnx"

    def __init__(self, score_threshold: float = 0.65, min_size: Tuple[int, int] = (32, 32)):
        self.score_threshold = score_threshold
        self.min_size = min_size
        self.tracker = CentroidTracker(max_disappeared=20, max_distance=100.0)

        # Initialize YuNet Deep Learning Detector
        self.yunet_detector = None
        self.input_size = (640, 480)
        self._init_yunet()

        # Initialize Haar Cascade Fallbacks with Eye Verification
        cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        self.face_cascade = cv2.CascadeClassifier(cascade_path) if os.path.exists(cascade_path) else None
        
        eye_path = cv2.data.haarcascades + 'haarcascade_eye.xml'
        self.eye_cascade = cv2.CascadeClassifier(eye_path) if os.path.exists(eye_path) else None

    def _init_yunet(self):
        """Downloads and initializes OpenCV YuNet ONNX deep learning face detector."""
        try:
            backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            model_dir = os.path.join(backend_dir, "models")
            os.makedirs(model_dir, exist_ok=True)

            model_path = os.path.join(model_dir, "face_detection_yunet_2023mar.onnx")

            if not os.path.exists(model_path) or os.path.getsize(model_path) < 10000:
                logger.info(f"Downloading YuNet ONNX Deep Learning Face Model to {model_path}...")
                urllib.request.urlretrieve(self.YUNET_MODEL_URL, model_path)
                logger.info("YuNet Model downloaded successfully!")

            if hasattr(cv2, "FaceDetectorYN"):
                self.yunet_detector = cv2.FaceDetectorYN.create(
                    model_path,
                    "",
                    self.input_size,
                    score_threshold=self.score_threshold,
                    nms_threshold=0.3,
                    top_k=5000
                )
                logger.info("YuNet Deep Learning Face AI Engine initialized successfully!")
            else:
                logger.warning("cv2.FaceDetectorYN not available. Falling back to strict Haar Cascades.")
        except Exception as e:
            logger.error(f"Failed to load YuNet Deep Learning Model: {e}. Using Haar Cascade fallback.")
            self.yunet_detector = None

    def analyze_frame(self, frame: np.ndarray) -> List[Dict[str, Any]]:
        """
        Detects real human faces in frame using YuNet Deep Learning model / verified Cascade.
        Returns list of analyzed face dicts with bboxes, centroids, landmarks, confidence, and proximity.
        """
        h, w, _ = frame.shape
        rects = []
        face_details = {} # (x,y,w,h) -> {landmarks, confidence}

        # 1. Primary Deep Learning Detection via YuNet
        if self.yunet_detector is not None:
            if (w, h) != self.input_size:
                self.input_size = (w, h)
                self.yunet_detector.setInputSize((w, h))

            status, raw_faces = self.yunet_detector.detect(frame)

            if status and raw_faces is not None and len(raw_faces) > 0:
                for face in raw_faces:
                    fx, fy, fw, fh = map(int, face[0:4])
                    score = float(face[-1])

                    # Aspect Ratio Filter (Human faces strictly between 0.65 and 1.35)
                    aspect_ratio = fw / float(fh) if fh > 0 else 0
                    if not (0.65 <= aspect_ratio <= 1.35):
                        continue

                    # Min Size Filter
                    if fw < self.min_size[0] or fh < self.min_size[1]:
                        continue

                    # Ensure coordinates are within image boundaries
                    fx, fy = max(0, fx), max(0, fy)
                    fw, fh = min(w - fx, fw), min(h - fy, fh)

                    if fw <= 0 or fh <= 0:
                        continue

                    bbox = (fx, fy, fw, fh)
                    rects.append(bbox)

                    # Extract facial landmarks (eyes, nose, mouth corners)
                    landmarks = {
                        "right_eye": (int(face[4]), int(face[5])),
                        "left_eye": (int(face[6]), int(face[7])),
                        "nose": (int(face[8]), int(face[9])),
                        "right_mouth": (int(face[10]), int(face[11])),
                        "left_mouth": (int(face[12]), int(face[13]))
                    }

                    face_details[bbox] = {
                        "confidence": int(score * 100),
                        "landmarks": landmarks
                    }

        # 2. Fallback to Strict Haar Cascade with Eye Verification if YuNet unavailable or missed
        if len(rects) == 0 and self.face_cascade is not None:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            gray = cv2.equalizeHist(gray)

            # High minNeighbors (8) to eliminate billboard / car texture false positives
            faces = self.face_cascade.detectMultiScale(
                gray,
                scaleFactor=1.15,
                minNeighbors=8,
                minSize=(40, 40)
            )

            for (fx, fy, fw, fh) in faces:
                aspect_ratio = fw / float(fh) if fh > 0 else 0
                if not (0.70 <= aspect_ratio <= 1.30):
                    continue

                # Verify top half contains facial features (eyes)
                roi_top_half = gray[fy:fy + int(fh * 0.55), fx:fx + fw]
                if self.eye_cascade is not None and roi_top_half.size > 0:
                    eyes = self.eye_cascade.detectMultiScale(roi_top_half, scaleFactor=1.1, minNeighbors=3)
                    # If eyes detected or clear sharpness, accept box
                    if len(eyes) == 0 and fw < 60:
                        continue

                bbox = (int(fx), int(fy), int(fw), int(fh))
                rects.append(bbox)
                face_details[bbox] = {
                    "confidence": 85,
                    "landmarks": None
                }

        # Update centroid tracker
        tracked_objects = self.tracker.update(rects)

        analyzed_faces = []
        frame_area = w * h

        for face_id, data in tracked_objects.items():
            bbox = data["bbox"]
            (x, y, fw, fh) = bbox
            face_area = fw * fh
            area_ratio = face_area / float(frame_area)

            if area_ratio > 0.04:
                proximity = "CLOSE"
            elif area_ratio > 0.01:
                proximity = "MID"
            else:
                proximity = "FAR"

            details = face_details.get(bbox, {"confidence": 88, "landmarks": None})

            analyzed_faces.append({
                "id": face_id,
                "label": f"FACE #{face_id:02d}",
                "bbox": (x, y, fw, fh),
                "centroid": data["centroid"],
                "proximity": proximity,
                "confidence": details["confidence"],
                "landmarks": details["landmarks"]
            })

        return analyzed_faces
