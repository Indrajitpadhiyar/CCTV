import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, field_validator
from app.core.security import sanitize_rtsp_url


class StreamCreate(BaseModel):
    camera_id: uuid.UUID
    stream_url: str
    stream_type: str = "main"


class StreamUpdate(BaseModel):
    stream_url: Optional[str] = None
    stream_type: Optional[str] = None
    status: Optional[str] = None


class StreamRead(BaseModel):
    id: uuid.UUID
    camera_id: uuid.UUID
    stream_url: str
    stream_type: str
    status: str
    last_connected_at: Optional[datetime] = None
    last_error: Optional[str] = None
    reconnect_count: int
    created_at: datetime

    @field_validator("stream_url")
    @classmethod
    def mask_stream_url(cls, v: str) -> str:
        return sanitize_rtsp_url(v) or v

    model_config = ConfigDict(from_attributes=True)
