import uuid
from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, ConfigDict


class EventRead(BaseModel):
    id: uuid.UUID
    event_type: str
    camera_id: Optional[uuid.UUID] = None
    timestamp: datetime
    severity: str
    extra_metadata: Optional[Dict[str, Any]] = None
    detection_id: Optional[uuid.UUID] = None
    alert_id: Optional[uuid.UUID] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
