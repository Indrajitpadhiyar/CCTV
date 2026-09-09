import os
import urllib.request
import cv2
import numpy as np
from typing import List, Dict, Tuple, Any, Optional

import config
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
    High-Precision Real-Time Face AI & Target Photo Matching Engine.
    Uses OpenCV YuNet Deep Learning ONNX model for detection and SFace ONNX model for 128-d deep feature matching.
    """

    YUNET_MODEL_URL = "https://github.com/opencv/opencv_zoo/raw/main/models/face_detection_yunet/face_detection_yunet_2023mar.onnx"
    SFACE_MODEL_URL = "https://github.com/opencv/opencv_zoo/raw/main/models/face_recognition_sface/face_recognition_sface_2021dec.onnx"

    def __init__(self, score_threshold: float = 0.30, min_size: Tuple[int, int] = (12, 12), match_threshold: float = 0.363, multi_face_mode: Optional[bool] = None):
        self.score_threshold = score_threshold
        self.min_size = min_size
        self.match_threshold = match_threshold
        self.tracker = CentroidTracker(max_disappeared=15, max_distance=60.0)

        # Initialize YuNet & SFace Models
        self.yunet_detector = None
        self.sface_recognizer = None
        self.input_size = (960, 540)
        
        self.target_features = []  # List of dicts: {"name": str, "feature": np.ndarray}
        self.target_matching_enabled = True
        self.match_only_mode = False  # If True, ONLY matched faces are tracked & displayed
        self.multi_face_mode = multi_face_mode if multi_face_mode is not None else getattr(config, "MULTI_FACE_DEFAULT", True)
        self.max_faces = getattr(config, "MAX_FACES_LIMIT", 50)
        self.match_cache = {}  # face_id -> {"is_match": bool, "match_name": str, "match_score": int, "last_updated": int}
        self.frame_count = 0

        self._init_models()

        # Haar Cascade Fallback Classifier
        try:
            cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
            self.haar_cascade = cv2.CascadeClassifier(cascade_path)
        except Exception as e:
            logger.warning(f"Haar Cascade fallback unavailable: {e}")
            self.haar_cascade = None

    def _init_models(self):
        """Downloads and initializes OpenCV YuNet face detector and SFace recognizer models."""
        try:
            backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            model_dir = os.path.join(backend_dir, "models")
            os.makedirs(model_dir, exist_ok=True)

            yunet_path = os.path.join(model_dir, "face_detection_yunet_2023mar.onnx")
            sface_path = os.path.join(model_dir, "face_recognition_sface_2021dec.onnx")

            # Download YuNet if missing
            if not os.path.exists(yunet_path) or os.path.getsize(yunet_path) < 10000:
                logger.info(f"Downloading YuNet ONNX Face Model to {yunet_path}...")
                urllib.request.urlretrieve(self.YUNET_MODEL_URL, yunet_path)
                logger.info("YuNet Model downloaded successfully!")

            # Download SFace if missing
            if not os.path.exists(sface_path) or os.path.getsize(sface_path) < 10000:
                logger.info(f"Downloading SFace ONNX Recognition Model to {sface_path}...")
                urllib.request.urlretrieve(self.SFACE_MODEL_URL, sface_path)
                logger.info("SFace Model downloaded successfully!")

            if hasattr(cv2, "FaceDetectorYN"):
                self.yunet_detector = cv2.FaceDetectorYN.create(
                    yunet_path, "", self.input_size,
                    score_threshold=self.score_threshold, nms_threshold=0.4, top_k=500
                )
                logger.info("YuNet Deep Learning Face Detector initialized successfully!")
            
            if hasattr(cv2, "FaceRecognizerSF"):
                self.sface_recognizer = cv2.FaceRecognizerSF.create(sface_path, "")
                logger.info("SFace Deep Learning Face Recognizer initialized successfully!")
        except Exception as e:
            logger.error(f"Failed to initialize Face AI Models: {e}")

    def load_target_photos(self, target_path: str = None) -> int:
        """
        Loads reference target photos from directory or file and computes 128-d deep feature embeddings.
        Supports automatic candidate resolution across targets/, image/, workspace, and backend folders.
        Returns number of targets loaded.
        """
        self.target_features.clear()
        backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        workspace_dir = os.path.dirname(backend_dir)

        image_files = []

        if target_path and target_path.lower() != "auto":
            candidates = [
                target_path,
                os.path.abspath(target_path),
                os.path.join(backend_dir, target_path),
                os.path.join(workspace_dir, target_path),
                os.path.join(backend_dir, "image", target_path),
                os.path.join(backend_dir, "image", os.path.basename(target_path)),
                os.path.join(workspace_dir, "image", os.path.basename(target_path)),
                os.path.join(backend_dir, "targets", os.path.basename(target_path)),
            ]
            found_file = None
            for cand in candidates:
                if cand and os.path.exists(cand) and os.path.isfile(cand):
                    found_file = os.path.abspath(cand)
                    break

            # Fuzzy match if filename slightly differs (e.g. king.png vs kig.png)
            if not found_file:
                target_base = os.path.splitext(os.path.basename(target_path))[0].lower()
                search_dirs = [
                    os.path.join(backend_dir, "image"),
                    os.path.join(backend_dir, "targets"),
                    os.path.join(workspace_dir, "image")
                ]
                for sdir in search_dirs:
                    if os.path.exists(sdir):
                        for fn in os.listdir(sdir):
                            fn_stem = os.path.splitext(fn)[0].lower()
                            if target_base in fn_stem or fn_stem in target_base:
                                found_file = os.path.join(sdir, fn)
                                break
                    if found_file:
                        break

            if found_file:
                image_files.append(found_file)
            elif os.path.exists(target_path) and os.path.isdir(target_path):
                for fname in os.listdir(target_path):
                    if fname.lower().endswith((".jpg", ".jpeg", ".png", ".bmp", ".webp")):
                        image_files.append(os.path.join(target_path, fname))
            else:
                logger.error(f"Specified target image not found: {target_path}")

        # Fallback search if auto or no direct file resolved
        if not image_files:
            search_folders = [
                os.path.join(backend_dir, "targets"),
                os.path.join(backend_dir, "image")
            ]
            for folder in search_folders:
                if os.path.exists(folder):
                    for fname in os.listdir(folder):
                        if fname.lower().endswith((".jpg", ".jpeg", ".png", ".bmp", ".webp")):
                            image_files.append(os.path.join(folder, fname))
                    if image_files:
                        break

        if not image_files:
            logger.info("No target reference photos loaded.")
            return 0

        for img_path in image_files:
            try:
                img = cv2.imread(img_path)
                if img is None:
                    continue
                name = os.path.splitext(os.path.basename(img_path))[0]

                # Extract SFace Deep Feature Vector
                feat = self.extract_face_feature(img)
                if feat is not None:
                    self.target_features.append({
                        "name": name.upper(),
                        "feature": feat,
                        "path": img_path
                    })
                    logger.info(f"Target loaded: '{name.upper()}' from {os.path.basename(img_path)}")
                else:
                    logger.warning(f"No human face detected in reference target photo: {os.path.basename(img_path)}")
            except Exception as e:
                logger.error(f"Failed to process target photo {img_path}: {e}")

        logger.info(f"Total reference target photo(s) active for real-time video matching: {len(self.target_features)}")
        return len(self.target_features)

    def extract_face_feature(self, img: np.ndarray) -> Optional[np.ndarray]:
        """Extracts 128-d SFace feature embedding vector from an input image with multi-scale fallback."""
        if self.yunet_detector is None or self.sface_recognizer is None:
            return None

        # Multi-scale passes (1.0x, 1.5x, 2.0x) to locate target faces in reference photos
        scales = [1.0, 1.5, 2.0]
        for scale in scales:
            target_img = cv2.resize(img, (0, 0), fx=scale, fy=scale) if scale != 1.0 else img
            h, w, _ = target_img.shape
            self.yunet_detector.setInputSize((w, h))
            status, raw_faces = self.yunet_detector.detect(target_img)

            if status and raw_faces is not None and len(raw_faces) > 0:
                aligned_face = self.sface_recognizer.alignCrop(target_img, raw_faces[0])
                feature = self.sface_recognizer.feature(aligned_face)
                return feature
        return None

    def match_feature(self, query_feature: np.ndarray) -> Tuple[bool, str, int]:
        """
        Compares query face feature vector against loaded target photo features.
        Returns (is_match, target_name, match_percentage).
        """
        if query_feature is None or not self.target_features or self.sface_recognizer is None:
            return False, "", 0

        best_score = -1.0
        best_name = ""

        for target in self.target_features:
            score = self.sface_recognizer.match(target["feature"], query_feature, cv2.FaceRecognizerSF_FR_COSINE)
            if score > best_score:
                best_score = score
                best_name = target["name"]

        if best_score >= self.match_threshold:
            # Scale cosine similarity (0.363 to 1.0) to display percentage (75% to 99%)
            display_pct = int(min(99, max(75, 75 + (best_score - 0.363) * (24.0 / 0.637))))
            return True, best_name, display_pct

        return False, "", 0

    def analyze_frame(self, frame: np.ndarray) -> List[Dict[str, Any]]:
        """
        Detects real human faces in frame and performs real-time target photo matching.
        Returns list of analyzed face dicts with bboxes, centroids, landmarks, confidence, and target match info.
        """
        self.frame_count += 1
        h, w, _ = frame.shape
        rects = []
        raw_face_lookup = {}

        # 1. Primary: YuNet Deep Learning Detector
        if self.yunet_detector is not None:
            det_scale = 800.0 / w if w > 800 else 1.0
            sw, sh = int(w * det_scale), int(h * det_scale)
            if (sw, sh) != self.input_size:
                self.input_size = (sw, sh)
                self.yunet_detector.setInputSize((sw, sh))

            det_frame = cv2.resize(frame, (sw, sh)) if det_scale != 1.0 else frame
            status, raw_faces = self.yunet_detector.detect(det_frame)

            # Secondary High-Recall Scale Pass if no faces detected on standard scale
            if (not status or raw_faces is None or len(raw_faces) == 0) and det_scale != 1.0:
                self.yunet_detector.setInputSize((w, h))
                status, raw_faces = self.yunet_detector.detect(frame)
                det_scale = 1.0

            if status and raw_faces is not None and len(raw_faces) > 0:
                max_w = min(int(w * 0.85), 800)
                max_h = min(int(h * 0.85), 800)

                for f in raw_faces:
                    fx, fy, fw, fh = f[0:4] / det_scale
                    score = float(f[-1])

                    # Face Size Bounds
                    if fw > max_w or fh > max_h or fw < self.min_size[0] or fh < self.min_size[1]:
                        continue

                    # Aspect Ratio Bounds (Human face 0.50 to 1.35)
                    aspect = fw / float(fh) if fh > 0 else 0
                    if not (0.50 <= aspect <= 1.35):
                        continue

                    # Ensure coordinates stay within frame
                    if fx < 0 or fy < 0 or fx + fw > w or fy + fh > h:
                        continue

                    bbox = (int(fx), int(fy), int(fw), int(fh))
                    rects.append(bbox)

                    lmarks = f[4:14] / det_scale
                    landmarks_dict = {
                        "right_eye": (int(lmarks[0]), int(lmarks[1])),
                        "left_eye": (int(lmarks[2]), int(lmarks[3])),
                        "nose": (int(lmarks[4]), int(lmarks[5])),
                        "right_mouth": (int(lmarks[6]), int(lmarks[7])),
                        "left_mouth": (int(lmarks[8]), int(lmarks[9]))
                    }

                    display_conf = int(min(99, max(75, int(score * 100))))
                    raw_face_lookup[bbox] = (f, display_conf, landmarks_dict)

        # 2. Fallback: Haar Cascade if no faces found by YuNet
        if len(rects) == 0 and self.haar_cascade is not None:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            gray = cv2.equalizeHist(gray)
            detected_haar = self.haar_cascade.detectMultiScale(
                gray, scaleFactor=1.1, minNeighbors=4, minSize=self.min_size
            )
            for (fx, fy, fw, fh) in detected_haar:
                bbox = (int(fx), int(fy), int(fw), int(fh))
                rects.append(bbox)
                raw_face_lookup[bbox] = (None, 85, None)

        # 3. Apply Multi-Face / Single-Face mode filtering
        if not self.multi_face_mode and len(rects) > 1:
            # Single face mode: pick largest/most prominent face
            rects.sort(key=lambda b: b[2] * b[3], reverse=True)
            rects = rects[:1]
        elif self.multi_face_mode and len(rects) > self.max_faces:
            rects.sort(key=lambda b: b[2] * b[3], reverse=True)
            rects = rects[:self.max_faces]

        # Update Centroid Tracker
        tracked_objects = self.tracker.update(rects)

        # Clean up obsolete cached face IDs
        active_ids = set(tracked_objects.keys())
        for cached_id in list(self.match_cache.keys()):
            if cached_id not in active_ids:
                del self.match_cache[cached_id]

        analyzed_faces = []
        frame_area = w * h

        for face_id, data in tracked_objects.items():
            bbox = data["bbox"]
            (x, y, fw, fh) = bbox
            face_area = fw * fh
            area_ratio = face_area / float(frame_area)

            if area_ratio > 0.04:
                proximity = "CLOSE"
            elif area_ratio > 0.008:
                proximity = "MID"
            else:
                proximity = "FAR"

            # Lookup raw face detection metadata
            f_info = raw_face_lookup.get(bbox)
            if not f_info and raw_face_lookup:
                closest_bbox = min(raw_face_lookup.keys(), key=lambda b: abs(b[0]-x) + abs(b[1]-y))
                f_info = raw_face_lookup[closest_bbox]

            display_conf = f_info[1] if f_info else 80
            landmarks_dict = f_info[2] if f_info else None
            raw_f = f_info[0] if f_info else None

            # SFace Deep Feature Matching with Caching per face_id
            is_match, match_name, match_pct = False, "", 0
            if self.sface_recognizer is not None and self.target_features and self.target_matching_enabled:
                cached = self.match_cache.get(face_id)
                if cached and (self.frame_count - cached["last_updated"]) < 30:
                    is_match = cached["is_match"]
                    match_name = cached["match_name"]
                    match_pct = cached["match_score"]
                elif raw_f is not None:
                    try:
                        det_scale = 800.0 / w if w > 800 else 1.0
                        unscaled_f = raw_f.copy()
                        if det_scale != 1.0:
                            unscaled_f[0:4] /= det_scale
                            unscaled_f[4:14] /= det_scale
                        aligned = self.sface_recognizer.alignCrop(frame, unscaled_f)
                        frame_feat = self.sface_recognizer.feature(aligned)
                        is_match, match_name, match_pct = self.match_feature(frame_feat)
                        self.match_cache[face_id] = {
                            "is_match": is_match,
                            "match_name": match_name,
                            "match_score": match_pct,
                            "last_updated": self.frame_count
                        }
                    except Exception:
                        pass
                elif cached:
                    is_match = cached["is_match"]
                    match_name = cached["match_name"]
                    match_pct = cached["match_score"]

            analyzed_faces.append({
                "id": face_id,
                "label": f"FACE #{face_id:02d}",
                "bbox": (x, y, fw, fh),
                "centroid": data["centroid"],
                "proximity": proximity,
                "confidence": display_conf,
                "landmarks": landmarks_dict,
                "is_match": is_match,
                "match_name": match_name,
                "match_score": match_pct
            })

        if self.match_only_mode and self.target_features and self.target_matching_enabled:
            analyzed_faces = [f for f in analyzed_faces if f["is_match"]]

        return analyzed_faces




