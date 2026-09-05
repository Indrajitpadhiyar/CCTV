import os
import cv2
import numpy as np
from typing import List, Dict, Tuple, Any

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
    """Real-time face detection, tracking, and metric analysis for CCTV streams."""

    def __init__(self, scale_factor: float = 1.1, min_neighbors: int = 5, min_size: Tuple[int, int] = (30, 30)):
        # Load frontal face cascade
        cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        if not os.path.exists(cascade_path):
            raise FileNotFoundError(f"OpenCV Haar Cascade model not found at {cascade_path}")

        self.face_cascade = cv2.CascadeClassifier(cascade_path)
        
        # Load profile face cascade for side-angle detection
        profile_path = cv2.data.haarcascades + 'haarcascade_profileface.xml'
        self.profile_cascade = cv2.CascadeClassifier(profile_path) if os.path.exists(profile_path) else None

        self.scale_factor = scale_factor
        self.min_neighbors = min_neighbors
        self.min_size = min_size
        self.tracker = CentroidTracker(max_disappeared=20, max_distance=100.0)

    def analyze_frame(self, frame: np.ndarray) -> List[Dict[str, Any]]:
        """
        Detects faces in frame, updates tracker, and returns analyzed face metadata.
        Returns list of dicts: [ { 'id': int, 'label': str, 'bbox': (x,y,w,h), 'centroid': (cx,cy), 'proximity': str, 'confidence': int }, ... ]
        """
        h, w, _ = frame.shape
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        gray = cv2.equalizeHist(gray)  # Enhance contrast for surveillance lighting

        # Detect frontal faces
        faces = self.face_cascade.detectMultiScale(
            gray,
            scaleFactor=self.scale_factor,
            minNeighbors=self.min_neighbors,
            minSize=self.min_size
        )

        rects = []
        if len(faces) > 0:
            for (x, y, fw, fh) in faces:
                rects.append((int(x), int(y), int(fw), int(fh)))

        # Also check profile faces if few or no frontal faces found
        if len(rects) == 0 and self.profile_cascade is not None:
            profile_faces = self.profile_cascade.detectMultiScale(
                gray,
                scaleFactor=1.15,
                minNeighbors=4,
                minSize=self.min_size
            )
            for (x, y, fw, fh) in profile_faces:
                rects.append((int(x), int(y), int(fw), int(fh)))

        # Update centroid tracker
        tracked_objects = self.tracker.update(rects)

        analyzed_faces = []
        frame_area = w * h

        for face_id, data in tracked_objects.items():
            (x, y, fw, fh) = data["bbox"]
            face_area = fw * fh
            area_ratio = face_area / float(frame_area)

            # Classify proximity based on area ratio
            if area_ratio > 0.04:
                proximity = "CLOSE"
            elif area_ratio > 0.01:
                proximity = "MID"
            else:
                proximity = "FAR"

            # Confidence score estimation based on size & sharpness
            crop = gray[y:y+fh, x:x+fw]
            variance = cv2.Laplacian(crop, cv2.CV_64F).var() if crop.size > 0 else 50.0
            confidence = min(99, max(60, int(70 + min(29, variance / 10.0))))

            analyzed_faces.append({
                "id": face_id,
                "label": f"FACE #{face_id:02d}",
                "bbox": (x, y, fw, fh),
                "centroid": data["centroid"],
                "proximity": proximity,
                "confidence": confidence
            })

        return analyzed_faces
