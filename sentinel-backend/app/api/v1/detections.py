import uuid
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.detection import DetectionRead
from app.schemas.response import StandardResponse, PaginatedResponse
from app.services.detection_service import DetectionService
from app.utils.pagination import paginate
from app.api.deps import require_role
from app.models.user import User

router = APIRouter(prefix="/detections", tags=["Detections"])


@router.get("", response_model=StandardResponse[PaginatedResponse[DetectionRead]])
async def list_detections(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    camera_id: Optional[uuid.UUID] = None,
    object_type: Optional[str] = None,
    min_confidence: Optional[float] = None,
    start_time: Optional[datetime] = None,
    end_time: Optional[datetime] = None,
    track_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR", "INVESTIGATOR", "VIEWER"))
):
    service = DetectionService(db)
    detections, total = await service.list_detections(
        page=page,
        page_size=page_size,
        camera_id=camera_id,
        object_type=object_type,
        min_confidence=min_confidence,
        start_time=start_time,
        end_time=end_time,
        track_id=track_id
    )
    paginated = paginate(detections, total, page, page_size)
    return StandardResponse(data=paginated, message="Detections retrieved")


@router.get("/{detection_id}", response_model=StandardResponse[DetectionRead])
async def get_detection(
    detection_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR", "INVESTIGATOR", "VIEWER"))
):
    service = DetectionService(db)
    detection = await service.get_by_id(detection_id)
    return StandardResponse(data=detection, message="Detection retrieved")
