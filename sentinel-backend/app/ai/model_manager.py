from app.ai.yolo_detector import YOLODetector
from app.ai.anpr import ANPRService
from app.ai.person_reid import PersonReIDService
from app.ai.tracker import MultiObjectTracker
from app.core.config import settings


class AIModelManager:
    """Central AI Model Orchestrator and Factory."""

    def __init__(self):
        self.detector = YOLODetector(settings.YOLO_MODEL_PATH)
        self.anpr = ANPRService()
        self.reid = PersonReIDService()
        self.tracker = MultiObjectTracker()


ai_manager = AIModelManager()
