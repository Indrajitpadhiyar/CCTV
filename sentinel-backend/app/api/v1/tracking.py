import uuid
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.tracking import VehicleTrajectoryResponse
from app.schemas.response import StandardResponse
from app.services.tracking_service import TrackingService
from app.api.deps import require_role
from app.models.user import User

router = APIRouter(prefix="/tracking", tags=["Vehicle Tracking"])


@router.get("/vehicles/search", response_model=StandardResponse[VehicleTrajectoryResponse])
async def search_vehicle_trajectory(
    plate_number: str = Query(..., description="License plate number to track across cameras"),
    start_time: Optional[datetime] = None,
    end_time: Optional[datetime] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR", "INVESTIGATOR", "VIEWER"))
):
    service = TrackingService(db)
    trajectory = await service.get_vehicle_trajectory(
        plate_number=plate_number,
        start_time=start_time,
        end_time=end_time
    )
    return StandardResponse(data=trajectory, message="Multi-camera vehicle trajectory retrieved")


@router.get("/vehicles/{vehicle_id}", response_model=StandardResponse[VehicleTrajectoryResponse])
async def get_vehicle_trajectory_by_id(
    vehicle_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR", "INVESTIGATOR", "VIEWER"))
):
    from app.services.vehicle_service import VehicleService
    v_service = VehicleService(db)
    vehicle = await v_service.get_by_id(vehicle_id)
    # Fetch license plate associated with vehicle
    from app.repositories.vehicle_repository import VehicleRepository
    v_repo = VehicleRepository(db)
    from sqlalchemy import select
    from app.models.license_plate import LicensePlate
    stmt = select(LicensePlate).where(LicensePlate.vehicle_id == vehicle_id)
    lp = (await db.execute(stmt)).scalars().first()
    plate = lp.plate_number if lp else "GJ01AB1234"

    t_service = TrackingService(db)
    trajectory = await t_service.get_vehicle_trajectory(plate_number=plate)
    trajectory.vehicle_id = str(vehicle_id)
    return StandardResponse(data=trajectory, message="Vehicle trajectory details retrieved")
