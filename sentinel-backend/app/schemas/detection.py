import uuid
from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, ConfigDict


class DetectionCreate(BaseModel):
    camera_id: uuid.UUID
    timestamp: Optional[datetime] = None
    frame_id: Optional[str] = None
    object_type: str
    confidence: float
    bounding_box: Dict[str, Any]
    track_id: Optional[str] = None
    model_name: str = "yolov8x"
    extra_metadata: Optional[Dict[str, Any]] = None


class DetectionRead(BaseModel):
    id: uuid.UUID
    camera_id: uuid.UUID
    timestamp: datetime
    frame_id: Optional[str] = None
    object_type: str
    confidence: float
    bounding_box: Dict[str, Any]
    track_id: Optional[str] = None
    model_name: str
    extra_metadata: Optional[Dict[str, Any]] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
