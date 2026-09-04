import uuid
from typing import Optional, List
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.stream import Stream


class StreamRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, stream_id: uuid.UUID) -> Optional[Stream]:
        stmt = select(Stream).where(Stream.id == stream_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_camera_id(self, camera_id: uuid.UUID) -> List[Stream]:
        stmt = select(Stream).where(Stream.camera_id == camera_id)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def create(self, stream: Stream) -> Stream:
        self.session.add(stream)
        await self.session.flush()
        await self.session.refresh(stream)
        return stream

    async def delete(self, stream_id: uuid.UUID) -> bool:
        stmt = delete(Stream).where(Stream.id == stream_id)
        result = await self.session.execute(stmt)
        return result.rowcount > 0
