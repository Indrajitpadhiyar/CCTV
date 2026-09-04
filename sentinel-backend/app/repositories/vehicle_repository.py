import uuid
from datetime import datetime
from typing import Optional, List, Tuple
from sqlalchemy import select, func, join
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.vehicle import Vehicle
from app.models.license_plate import LicensePlate
from app.models.camera import Camera


class VehicleRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, vehicle_id: uuid.UUID) -> Optional[Vehicle]:
        stmt = select(Vehicle).where(Vehicle.id == vehicle_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def search_by_plate(
        self,
        plate_number: str,
        exact_match: bool = False,
        camera_id: Optional[uuid.UUID] = None,
        district: Optional[str] = None,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None
    ) -> List[Tuple[LicensePlate, Camera]]:
        stmt = select(LicensePlate, Camera).join(Camera, LicensePlate.camera_id == Camera.id)
        
        if exact_match:
            stmt = stmt.where(LicensePlate.plate_number == plate_number.upper())
        else:
            stmt = stmt.where(LicensePlate.plate_number.ilike(f"%{plate_number}%"))

        if camera_id:
            stmt = stmt.where(LicensePlate.camera_id == camera_id)
        if district:
            stmt = stmt.where(Camera.district == district)
        if start_time:
            stmt = stmt.where(LicensePlate.timestamp >= start_time)
        if end_time:
            stmt = stmt.where(LicensePlate.timestamp <= end_time)

        stmt = stmt.order_by(LicensePlate.timestamp.desc())
        results = await self.session.execute(stmt)
        return list(results.all())

    async def create_vehicle(self, vehicle: Vehicle) -> Vehicle:
        self.session.add(vehicle)
        await self.session.flush()
        await self.session.refresh(vehicle)
        return vehicle

    async def create_license_plate(self, lp: LicensePlate) -> LicensePlate:
        self.session.add(lp)
        await self.session.flush()
        await self.session.refresh(lp)
        return lp
