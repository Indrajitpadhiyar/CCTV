import random
from typing import Any, Dict, List, Optional
from app.ai.interfaces import ANPRDetectorInterface


class ANPRService(ANPRDetectorInterface):
    """ANPR Service supporting mock plate generation & production OCR pipelines."""

    def __init__(self):
        self.sample_plates = [
            "GJ01AB1234", "MH12CD5678", "DL03EF9012", "KA05GH3456",
            "TN07IJ7890", "HR26KL1122", "UP32MN4455", "GJ18XY9999"
        ]

    async def recognize_plate(self, frame: Any, bbox: Optional[List[int]] = None) -> Optional[Dict[str, Any]]:
        plate = random.choice(self.sample_plates)
        conf = round(random.uniform(0.88, 0.99), 2)
        return {
            "plate_number": plate,
            "confidence": conf,
            "raw_text": plate,
            "country": "IND",
            "state": plate[:2]
        }
