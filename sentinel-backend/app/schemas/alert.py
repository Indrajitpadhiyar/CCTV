import uuid
from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, ConfigDict


class AlertCreate(BaseModel):
    type: str
    severity: str = "MEDIUM"
    camera_id: Optional[uuid.UUID] = None
    title: str
    description: Optional[str] = None
    extra_metadata: Optional[Dict[str, Any]] = None


class AlertUpdate(BaseModel):
    status: Optional[str] = None
    severity: Optional[str] = None
    description: Optional[str] = None


class AlertRead(BaseModel):
    id: uuid.UUID
    type: str
    severity: str
    status: str
    camera_id: Optional[uuid.UUID] = None
    timestamp: datetime
    title: str
    description: Optional[str] = None
    extra_metadata: Optional[Dict[str, Any]] = None
    acknowledged_by: Optional[uuid.UUID] = None
    acknowledged_at: Optional[datetime] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
