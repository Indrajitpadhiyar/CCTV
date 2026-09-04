import uuid
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.stream import StreamCreate, StreamUpdate, StreamRead
from app.schemas.response import StandardResponse
from app.services.stream_service import StreamService
from app.api.deps import require_role
from app.models.user import User

router = APIRouter(prefix="/streams", tags=["Streams"])


@router.post("", response_model=StandardResponse[StreamRead], status_code=status.HTTP_201_CREATED)
async def create_stream(
    payload: StreamCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR"))
):
    service = StreamService(db)
    stream = await service.create_stream(payload)
    return StandardResponse(data=stream, message="Stream created successfully")


@router.get("/{stream_id}", response_model=StandardResponse[StreamRead])
async def get_stream(
    stream_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR", "INVESTIGATOR", "VIEWER"))
):
    service = StreamService(db)
    stream = await service.get_by_id(stream_id)
    return StandardResponse(data=stream, message="Stream retrieved")


@router.delete("/{stream_id}", response_model=StandardResponse[dict])
async def delete_stream(
    stream_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN"))
):
    service = StreamService(db)
    deleted = await service.delete_stream(stream_id)
    return StandardResponse(data={"deleted": deleted}, message="Stream deleted")


@router.post("/{stream_id}/connect", response_model=StandardResponse[dict])
async def connect_stream(
    stream_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR"))
):
    service = StreamService(db)
    stream = await service.get_by_id(stream_id)
    stream.status = "connected"
    await db.flush()
    return StandardResponse(data={"connected": True, "stream_id": stream_id}, message="Stream connected")


@router.post("/{stream_id}/disconnect", response_model=StandardResponse[dict])
async def disconnect_stream(
    stream_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR"))
):
    service = StreamService(db)
    stream = await service.get_by_id(stream_id)
    stream.status = "disconnected"
    await db.flush()
    return StandardResponse(data={"disconnected": True, "stream_id": stream_id}, message="Stream disconnected")
