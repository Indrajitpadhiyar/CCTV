import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict


class TrajectoryPoint(BaseModel):
    camera_id: uuid.UUID
    camera_code: Optional[str] = None
    location_name: Optional[str] = None
    timestamp: datetime
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    confidence: float = 1.0


class VehicleTrajectoryResponse(BaseModel):
    vehicle_id: Optional[str] = None
    plate_number: str
    timeline: List[TrajectoryPoint]


class TrackRead(BaseModel):
    id: uuid.UUID
    entity_type: str
    entity_reference: str
    camera_id: uuid.UUID
    started_at: datetime
    ended_at: Optional[datetime] = None
    trajectory: Optional[List[Dict[str, Any]]] = None
    confidence: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
