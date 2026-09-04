import uuid
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.anpr import LicensePlateRead, VehiclePlateSearchResponse
from app.schemas.response import StandardResponse, PaginatedResponse
from app.services.anpr_service import ANPRService
from app.utils.pagination import paginate
from app.api.deps import require_role
from app.models.user import User

router = APIRouter(prefix="/anpr", tags=["ANPR"])


@router.get("/search", response_model=StandardResponse[VehiclePlateSearchResponse])
async def search_anpr(
    plate_number: str = Query(..., description="License plate query"),
    camera_id: Optional[uuid.UUID] = None,
    district: Optional[str] = None,
    start_time: Optional[datetime] = None,
    end_time: Optional[datetime] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR", "INVESTIGATOR", "VIEWER"))
):
    service = ANPRService(db)
    res = await service.search_by_plate(
        plate_number=plate_number,
        camera_id=camera_id,
        district=district,
        start_time=start_time,
        end_time=end_time
    )
    return StandardResponse(data=res, message="ANPR plate search completed")


@router.get("/{id}", response_model=StandardResponse[LicensePlateRead])
async def get_anpr_by_id(
    id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR", "INVESTIGATOR", "VIEWER"))
):
    # Fetch license plate by primary key ID
    from app.repositories.vehicle_repository import VehicleRepository
    from app.core.exceptions import NotFoundException
    repo = VehicleRepository(db)
    from sqlalchemy import select
    from app.models.license_plate import LicensePlate
    stmt = select(LicensePlate).where(LicensePlate.id == id)
    lp = (await db.execute(stmt)).scalar_one_or_none()
    if not lp:
        raise NotFoundException(resource="LicensePlate record", identifier=id)
    return StandardResponse(data=lp, message="ANPR record retrieved")
