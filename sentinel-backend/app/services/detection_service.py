import uuid
from datetime import datetime
from typing import Optional, List, Tuple, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.detection import Detection
from app.repositories.detection_repository import DetectionRepository
from app.schemas.detection import DetectionCreate
from app.ai.model_manager import ai_manager
from app.core.exceptions import NotFoundException


class DetectionService:
    def __init__(self, session: AsyncSession):
        self.detection_repo = DetectionRepository(session)

    async def get_by_id(self, detection_id: uuid.UUID) -> Detection:
        detection = await self.detection_repo.get_by_id(detection_id)
        if not detection:
            raise NotFoundException(resource="Detection", identifier=detection_id)
        return detection

    async def list_detections(
        self,
        page: int = 1,
        page_size: int = 50,
        camera_id: Optional[uuid.UUID] = None,
        object_type: Optional[str] = None,
        min_confidence: Optional[float] = None,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None,
        track_id: Optional[str] = None
    ) -> Tuple[List[Detection], int]:
        skip = (page - 1) * page_size
        return await self.detection_repo.list_detections(
            skip=skip,
            limit=page_size,
            camera_id=camera_id,
            object_type=object_type,
            min_confidence=min_confidence,
            start_time=start_time,
            end_time=end_time,
            track_id=track_id
        )

    async def detect_objects(self, frame: Any) -> List[dict]:
        """Detect objects using pluggable AI detector interface."""
        return await ai_manager.detector.detect(frame)
