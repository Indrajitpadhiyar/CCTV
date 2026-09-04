import os
from typing import Any, Dict, List
from app.ai.interfaces import ObjectDetectorInterface
from app.ai.detector import MockObjectDetector
from app.core.config import settings
from app.core.logging import logger


class YOLODetector(ObjectDetectorInterface):
    """Ultralytics YOLOv8 detector with automatic fallback."""

    def __init__(self, model_path: str = settings.YOLO_MODEL_PATH):
        self.model_path = model_path
        self.model = None
        self.mock_fallback = MockObjectDetector()
        
        if os.path.exists(model_path) and settings.AI_MODE == "production":
            try:
                from ultralytics import YOLO
                self.model = YOLO(model_path)
                logger.info(f"YOLO detector successfully loaded model from {model_path}")
            except Exception as e:
                logger.warning(f"Failed to load YOLO model: {e}. Falling back to mock detector.")
        else:
            logger.info("YOLO model file not found or AI_MODE=mock. Using mock detector.")

    async def detect(self, frame: Any) -> List[Dict[str, Any]]:
        if self.model is None:
            return await self.mock_fallback.detect(frame)
        
        try:
            results = self.model(frame, verbose=False)
            output = []
            for r in results:
                for box in r.boxes:
                    cls_id = int(box.cls[0])
                    label = self.model.names[cls_id]
                    conf = float(box.conf[0])
                    coords = box.xyxy[0].tolist()
                    output.append({
                        "object_type": label,
                        "confidence": round(conf, 2),
                        "box": [int(c) for c in coords],
                        "track_id": str(int(box.id[0])) if box.id is not None else None
                    })
            return output
        except Exception as e:
            logger.error(f"Error during YOLO inference: {e}")
            return await self.mock_fallback.detect(frame)
