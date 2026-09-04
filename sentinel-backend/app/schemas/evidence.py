import uuid
from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, ConfigDict


class EvidenceCreate(BaseModel):
    event_id: Optional[uuid.UUID] = None
    type: str # snapshot, video_clip, crop
    storage_path: str
    thumbnail_path: Optional[str] = None
    checksum: Optional[str] = None
    extra_metadata: Optional[Dict[str, Any]] = None


class EvidenceRead(BaseModel):
    id: uuid.UUID
    event_id: Optional[uuid.UUID] = None
    type: str
    storage_path: str
    thumbnail_path: Optional[str] = None
    timestamp: datetime
    checksum: Optional[str] = None
    extra_metadata: Optional[Dict[str, Any]] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
