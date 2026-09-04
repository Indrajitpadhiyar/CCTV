from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional


class ObjectDetectorInterface(ABC):
    """Abstract interface for object detection models."""

    @abstractmethod
    async def detect(self, frame: Any) -> List[Dict[str, Any]]:
        """
        Processes video frame and returns detection bounding boxes:
        [{'object_type': 'vehicle', 'confidence': 0.95, 'box': [x1, y1, x2, y2], 'track_id': '1'}]
        """
        pass


class ANPRDetectorInterface(ABC):
    """Abstract interface for Automatic Number Plate Recognition."""

    @abstractmethod
    async def recognize_plate(self, frame: Any, bbox: Optional[List[int]] = None) -> Optional[Dict[str, Any]]:
        """
        Extracts license plate number from frame or bounding box:
        {'plate_number': 'GJ01AB1234', 'confidence': 0.96, 'raw_text': 'GJ01AB1234'}
        """
        pass


class PersonReIDInterface(ABC):
    """Abstract interface for Person Re-Identification feature extraction."""

    @abstractmethod
    async def extract_embedding(self, frame: Any, bbox: Optional[List[int]] = None) -> List[float]:
        """Generates high-dimensional feature vector for person re-identification."""
        pass

    @abstractmethod
    async def calculate_similarity(self, embedding1: List[float], embedding2: List[float]) -> float:
        """Calculates cosine similarity between two feature vectors."""
        pass


class TrackerInterface(ABC):
    """Abstract interface for multi-object tracking (DeepSORT/BYTETrack)."""

    @abstractmethod
    async def update_tracks(self, detections: List[Dict[str, Any]], frame: Any) -> List[Dict[str, Any]]:
        """Associates detections across consecutive frames with track IDs."""
        pass
