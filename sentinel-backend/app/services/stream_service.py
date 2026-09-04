import uuid
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.stream import Stream
from app.repositories.stream_repository import StreamRepository
from app.schemas.stream import StreamCreate, StreamUpdate
from app.core.exceptions import NotFoundException


class StreamService:
    def __init__(self, session: AsyncSession):
        self.stream_repo = StreamRepository(session)

    async def create_stream(self, payload: StreamCreate) -> Stream:
        stream = Stream(**payload.model_dump())
        return await self.stream_repo.create(stream)

    async def get_by_id(self, stream_id: uuid.UUID) -> Stream:
        stream = await self.stream_repo.get_by_id(stream_id)
        if not stream:
            raise NotFoundException(resource="Stream", identifier=stream_id)
        return stream

    async def get_by_camera_id(self, camera_id: uuid.UUID) -> List[Stream]:
        return await self.stream_repo.get_by_camera_id(camera_id)

    async def delete_stream(self, stream_id: uuid.UUID) -> bool:
        await self.get_by_id(stream_id)
        return await self.stream_repo.delete(stream_id)
