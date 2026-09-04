import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class VehicleRead(BaseModel):
    id: uuid.UUID
    detection_id: uuid.UUID
    camera_id: uuid.UUID
    timestamp: datetime
    vehicle_type: str
    color: Optional[str] = None
    make: Optional[str] = None
    model: Optional[str] = None
    confidence: float
    track_id: Optional[str] = None
    embedding_reference: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
