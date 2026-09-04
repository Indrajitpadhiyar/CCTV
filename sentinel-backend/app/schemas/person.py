import uuid
from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, ConfigDict


class PersonRead(BaseModel):
    id: uuid.UUID
    camera_id: uuid.UUID
    timestamp: datetime
    track_id: Optional[str] = None
    confidence: float
    embedding_reference: Optional[str] = None
    attributes: Optional[Dict[str, Any]] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PersonSearchRequest(BaseModel):
    image_base64: Optional[str] = None
    embedding: Optional[List[float]] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    camera_ids: Optional[List[uuid.UUID]] = None
    top_k: int = 10


class PersonSearchMatch(BaseModel):
    person_id: uuid.UUID
    camera_id: uuid.UUID
    timestamp: datetime
    similarity_score: float
    attributes: Optional[Dict[str, Any]] = None
