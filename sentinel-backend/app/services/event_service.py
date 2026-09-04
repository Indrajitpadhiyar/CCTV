import uuid
from datetime import datetime
from typing import Optional, List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.event import Event
from app.repositories.event_repository import EventRepository
from app.core.exceptions import NotFoundException


class EventService:
    def __init__(self, session: AsyncSession):
        self.event_repo = EventRepository(session)

    async def get_by_id(self, event_id: uuid.UUID) -> Event:
        event = await self.event_repo.get_by_id(event_id)
        if not event:
            raise NotFoundException(resource="Event", identifier=event_id)
        return event

    async def list_events(
        self,
        page: int = 1,
        page_size: int = 50,
        camera_id: Optional[uuid.UUID] = None,
        event_type: Optional[str] = None,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None
    ) -> Tuple[List[Event], int]:
        skip = (page - 1) * page_size
        return await self.event_repo.list_events(
            skip=skip,
            limit=page_size,
            camera_id=camera_id,
            event_type=event_type,
            start_time=start_time,
            end_time=end_time
        )
