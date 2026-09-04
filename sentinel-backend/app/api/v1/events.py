import uuid
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.event import EventRead
from app.schemas.response import StandardResponse, PaginatedResponse
from app.services.event_service import EventService
from app.utils.pagination import paginate
from app.api.deps import require_role
from app.models.user import User

router = APIRouter(prefix="/events", tags=["Events"])


@router.get("", response_model=StandardResponse[PaginatedResponse[EventRead]])
async def list_events(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    camera_id: Optional[uuid.UUID] = None,
    event_type: Optional[str] = None,
    start_time: Optional[datetime] = None,
    end_time: Optional[datetime] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR", "INVESTIGATOR", "VIEWER"))
):
    service = EventService(db)
    events, total = await service.list_events(
        page=page,
        page_size=page_size,
        camera_id=camera_id,
        event_type=event_type,
        start_time=start_time,
        end_time=end_time
    )
    paginated = paginate(events, total, page, page_size)
    return StandardResponse(data=paginated, message="Events retrieved")


@router.get("/{event_id}", response_model=StandardResponse[EventRead])
async def get_event(
    event_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR", "INVESTIGATOR", "VIEWER"))
):
    service = EventService(db)
    event = await service.get_by_id(event_id)
    return StandardResponse(data=event, message="Event retrieved")
