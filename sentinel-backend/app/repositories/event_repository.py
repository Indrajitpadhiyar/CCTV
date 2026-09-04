import uuid
from datetime import datetime
from typing import Optional, List, Tuple
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.event import Event


class EventRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, event_id: uuid.UUID) -> Optional[Event]:
        stmt = select(Event).where(Event.id == event_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def list_events(
        self,
        skip: int = 0,
        limit: int = 50,
        camera_id: Optional[uuid.UUID] = None,
        event_type: Optional[str] = None,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None
    ) -> Tuple[List[Event], int]:
        stmt = select(Event)
        count_stmt = select(func.count(Event.id))

        if camera_id:
            stmt = stmt.where(Event.camera_id == camera_id)
            count_stmt = count_stmt.where(Event.camera_id == camera_id)
        if event_type:
            stmt = stmt.where(Event.event_type == event_type)
            count_stmt = count_stmt.where(Event.event_type == event_type)
        if start_time:
            stmt = stmt.where(Event.timestamp >= start_time)
            count_stmt = count_stmt.where(Event.timestamp >= start_time)
        if end_time:
            stmt = stmt.where(Event.timestamp <= end_time)
            count_stmt = count_stmt.where(Event.timestamp <= end_time)

        total = (await self.session.execute(count_stmt)).scalar() or 0
        stmt = stmt.order_by(Event.timestamp.desc()).offset(skip).limit(limit)
        events = (await self.session.execute(stmt)).scalars().all()
        return list(events), total

    async def create(self, event: Event) -> Event:
        self.session.add(event)
        await self.session.flush()
        await self.session.refresh(event)
        return event
