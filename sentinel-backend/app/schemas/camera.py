import uuid
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, field_validator
from app.core.security import sanitize_rtsp_url


class CameraCreate(BaseModel):
    camera_code: str
    name: str
    description: Optional[str] = None
    vendor: Optional[str] = None
    model: Optional[str] = None
    protocol: str = "RTSP"
    rtsp_url: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    location_name: Optional[str] = None
    zone: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    fps: int = 25
    resolution: Optional[str] = "1920x1080"


class CameraUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    vendor: Optional[str] = None
    model: Optional[str] = None
    protocol: Optional[str] = None
    rtsp_url: Optional[str] = None
    status: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    location_name: Optional[str] = None
    zone: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    fps: Optional[int] = None
    resolution: Optional[str] = None


class CameraRead(BaseModel):
    id: uuid.UUID
    camera_code: str
    name: str
    description: Optional[str] = None
    vendor: Optional[str] = None
    model: Optional[str] = None
    protocol: str
    rtsp_url: str
    status: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    location_name: Optional[str] = None
    zone: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    fps: int
    resolution: Optional[str] = None
    last_seen_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    @field_validator("rtsp_url")
    @classmethod
    def mask_rtsp(cls, v: str) -> str:
        return sanitize_rtsp_url(v) or v

    model_config = ConfigDict(from_attributes=True)


class CameraGISMapPoint(BaseModel):
    camera_id: uuid.UUID
    camera_code: str
    name: str
    latitude: float
    longitude: float
    status: str
    zone: Optional[str] = None
    district: Optional[str] = None


class CameraStats(BaseModel):
    total_cameras: int
    online_cameras: int
    offline_cameras: int
    degraded_cameras: int
