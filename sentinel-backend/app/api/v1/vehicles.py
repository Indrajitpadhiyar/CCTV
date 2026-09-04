import uuid
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.vehicle import VehicleRead
from app.schemas.anpr import VehiclePlateSearchResponse
from app.schemas.response import StandardResponse
from app.services.vehicle_service import VehicleService
from app.services.anpr_service import ANPRService
from app.api.deps import require_role
from app.models.user import User

router = APIRouter(prefix="/vehicles", tags=["Vehicles"])


@router.get("/search", response_model=StandardResponse[VehiclePlateSearchResponse])
async def search_vehicles_by_plate(
    plate_number: str = Query(..., description="License plate number (e.g. GJ01AB1234)"),
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
    return StandardResponse(data=res, message="Vehicle plate search results retrieved")


@router.get("/{vehicle_id}", response_model=StandardResponse[VehicleRead])
async def get_vehicle(
    vehicle_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR", "INVESTIGATOR", "VIEWER"))
):
    service = VehicleService(db)
    vehicle = await service.get_by_id(vehicle_id)
    return StandardResponse(data=vehicle, message="Vehicle details retrieved")
