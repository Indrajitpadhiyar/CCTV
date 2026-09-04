import uuid
from datetime import datetime
from typing import Optional, List, Tuple
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.detection import Detection


class DetectionRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, detection_id: uuid.UUID) -> Optional[Detection]:
        stmt = select(Detection).where(Detection.id == detection_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def list_detections(
        self,
        skip: int = 0,
        limit: int = 50,
        camera_id: Optional[uuid.UUID] = None,
        object_type: Optional[str] = None,
        min_confidence: Optional[float] = None,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None,
        track_id: Optional[str] = None
    ) -> Tuple[List[Detection], int]:
        stmt = select(Detection)
        count_stmt = select(func.count(Detection.id))

        if camera_id:
            stmt = stmt.where(Detection.camera_id == camera_id)
            count_stmt = count_stmt.where(Detection.camera_id == camera_id)
        if object_type:
            stmt = stmt.where(Detection.object_type == object_type)
            count_stmt = count_stmt.where(Detection.object_type == object_type)
        if min_confidence is not None:
            stmt = stmt.where(Detection.confidence >= min_confidence)
            count_stmt = count_stmt.where(Detection.confidence >= min_confidence)
        if start_time:
            stmt = stmt.where(Detection.timestamp >= start_time)
            count_stmt = count_stmt.where(Detection.timestamp >= start_time)
        if end_time:
            stmt = stmt.where(Detection.timestamp <= end_time)
            count_stmt = count_stmt.where(Detection.timestamp <= end_time)
        if track_id:
            stmt = stmt.where(Detection.track_id == track_id)
            count_stmt = count_stmt.where(Detection.track_id == track_id)

        total = (await self.session.execute(count_stmt)).scalar() or 0
        stmt = stmt.order_by(Detection.timestamp.desc()).offset(skip).limit(limit)
        detections = (await self.session.execute(stmt)).scalars().all()
        return list(detections), total

    async def create(self, detection: Detection) -> Detection:
        self.session.add(detection)
        await self.session.flush()
        await self.session.refresh(detection)
        return detection
