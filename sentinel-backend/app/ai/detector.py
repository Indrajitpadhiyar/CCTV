import random
from typing import Any, Dict, List
from app.ai.interfaces import ObjectDetectorInterface


class MockObjectDetector(ObjectDetectorInterface):
    """High-fidelity mock detector for testing and CPU local dev."""

    def __init__(self):
        self.object_types = ["vehicle", "person", "motorcycle", "bus", "truck"]

    async def detect(self, frame: Any) -> List[Dict[str, Any]]:
        num_detections = random.randint(1, 4)
        results = []
        for i in range(num_detections):
            obj_type = random.choice(self.object_types)
            x1 = random.randint(50, 400)
            y1 = random.randint(50, 400)
            x2 = x1 + random.randint(100, 300)
            y2 = y1 + random.randint(100, 300)
            results.append({
                "object_type": obj_type,
                "confidence": round(random.uniform(0.82, 0.99), 2),
                "box": [x1, y1, x2, y2],
                "track_id": str(random.randint(100, 999))
            })
        return results
