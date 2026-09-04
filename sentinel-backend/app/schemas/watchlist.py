import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class WatchlistCreate(BaseModel):
    type: str # VEHICLE_PLATE, PERSON_REID
    value: str
    description: Optional[str] = None
    priority: str = "HIGH"
    is_active: bool = True


class WatchlistUpdate(BaseModel):
    value: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    is_active: Optional[bool] = None


class WatchlistRead(BaseModel):
    id: uuid.UUID
    type: str
    value: str
    description: Optional[str] = None
    priority: str
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
