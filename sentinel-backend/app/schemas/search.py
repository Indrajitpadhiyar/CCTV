import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel


class SearchResultItem(BaseModel):
    id: uuid.UUID
    entity_type: str # camera, vehicle, license_plate, person, alert, event
    title: str
    description: Optional[str] = None
    camera_id: Optional[uuid.UUID] = None
    timestamp: Optional[datetime] = None
    metadata: Optional[Dict[str, Any]] = None


class UnifiedSearchResponse(BaseModel):
    query: str
    total_results: int
    results: List[SearchResultItem]
