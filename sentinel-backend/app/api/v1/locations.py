import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.location import Location
from app.schemas.response import StandardResponse
from app.api.deps import require_role
from app.models.user import User


class LocationRead(BaseModel):
    id: uuid.UUID
    name: str
    latitude: float
    longitude: float
    district: Optional[str] = None
    state: Optional[str] = None
    zone: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


router = APIRouter(prefix="/locations", tags=["Locations"])


@router.get("", response_model=StandardResponse[List[LocationRead]])
async def list_locations(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR", "INVESTIGATOR", "VIEWER"))
):
    stmt = select(Location)
    locations = (await db.execute(stmt)).scalars().all()
    return StandardResponse(data=list(locations), message="Locations retrieved")
