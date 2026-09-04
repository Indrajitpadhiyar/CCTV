import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict


class LicensePlateRead(BaseModel):
    id: uuid.UUID
    vehicle_id: Optional[uuid.UUID] = None
    camera_id: uuid.UUID
    timestamp: datetime
    plate_number: str
    confidence: float
    country: Optional[str] = "IND"
    state: Optional[str] = None
    raw_text: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ANPRDetectionPoint(BaseModel):
    detection_id: Optional[uuid.UUID] = None
    camera_id: uuid.UUID
    camera_code: Optional[str] = None
    location_name: Optional[str] = None
    timestamp: datetime
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    confidence: float


class VehiclePlateSearchResponse(BaseModel):
    plate_number: str
    total_detections: int
    detections: List[ANPRDetectionPoint]
