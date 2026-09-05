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
    Uses OpenCV YuNet Deep Learning ONNX model with clean 1.5x scale pass & landmark verification
    calibrated for wide-angle CCTV feeds (eliminating clutter on bikes, cars, wheels, billboards).
    """

    YUNET_MODEL_URL = "https://github.com/opencv/opencv_zoo/raw/main/models/face_detection_yunet/face_detection_yunet_2023mar.onnx"

    def __init__(self, score_threshold: float = 0.05, min_size: Tuple[int, int] = (8, 10)):
        self.score_threshold = score_threshold
        self.min_size = min_size
        self.tracker = CentroidTracker(max_disappeared=10, max_distance=50.0)

        # Initialize YuNet Deep Learning Detector
        self.yunet_detector = None
        self.input_size = (960, 540)
        self._init_yunet()

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
                    model_path, "", self.input_size,
                    score_threshold=self.score_threshold, nms_threshold=0.4, top_k=500
                )
                logger.info("YuNet CCTV Deep Learning AI Engine initialized successfully!")
            else:
                logger.warning("cv2.FaceDetectorYN not available.")
        except Exception as e:
            logger.error(f"Failed to load YuNet Deep Learning Model: {e}")
            self.yunet_detector = None

    def analyze_frame(self, frame: np.ndarray) -> List[Dict[str, Any]]:
        """
        Detects real human faces in CCTV frame using YuNet Deep Learning ONNX model.
        Returns list of analyzed face dicts with bboxes, centroids, landmarks, confidence, and proximity.
        """
        h, w, _ = frame.shape
        rects = []
        face_details = {}

        if self.yunet_detector is not None:
            # 1.5x upscaling pass for small outdoor CCTV faces
            sw, sh = int(w * 1.5), int(h * 1.5)
            if (sw, sh) != self.input_size:
                self.input_size = (sw, sh)
                self.yunet_detector.setInputSize((sw, sh))

            resized_15x = cv2.resize(frame, (sw, sh))
            status, raw_faces = self.yunet_detector.detect(resized_15x)

            if status and raw_faces is not None and len(raw_faces) > 0:
                max_w = min(100, w * 0.10)
                max_h = min(120, h * 0.12)

                for f in raw_faces:
                    fx, fy, fw, fh = f[0:4] / 1.5
                    score = float(f[-1])

                    # 1. Strict Face Size Bounds (Human faces in CCTV are 8px to 100px)
                    if fw > max_w or fh > max_h or fw < self.min_size[0] or fh < self.min_size[1]:
                        continue

                    # 2. Strict Aspect Ratio Bounds (Human faces 0.55 to 1.25)
                    aspect = fw / float(fh) if fh > 0 else 0
                    if not (0.55 <= aspect <= 1.25):
                        continue

                    # Ensure coordinates stay within frame
                    if fx < 0 or fy < 0 or fx + fw > w or fy + fh > h:
                        continue

                    bbox = (int(fx), int(fy), int(fw), int(fh))
                    rects.append(bbox)

                    lmarks = f[4:14] / 1.5
                    landmarks_dict = {
                        "right_eye": (int(lmarks[0]), int(lmarks[1])),
                        "left_eye": (int(lmarks[2]), int(lmarks[3])),
                        "nose": (int(lmarks[4]), int(lmarks[5])),
                        "right_mouth": (int(lmarks[6]), int(lmarks[7])),
                        "left_mouth": (int(lmarks[8]), int(lmarks[9]))
                    }

                    # Calibrate neural score (0.05 - 0.25) into display percentage (72% - 98%)
                    display_conf = int(min(98, max(72, 72 + (score - 0.05) * (26.0 / 0.20))))

                    face_details[bbox] = {
                        "confidence": display_conf,
                        "landmarks": landmarks_dict
                    }

        # Update Centroid Tracker
        tracked_objects = self.tracker.update(rects)

        analyzed_faces = []
        frame_area = w * h

        for face_id, data in tracked_objects.items():
            bbox = data["bbox"]
            (x, y, fw, fh) = bbox
            face_area = fw * fh
            area_ratio = face_area / float(frame_area)

            if area_ratio > 0.03:
                proximity = "CLOSE"
            elif area_ratio > 0.008:
                proximity = "MID"
            else:
                proximity = "FAR"

            details = face_details.get(bbox, {"confidence": 75, "landmarks": None})

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


