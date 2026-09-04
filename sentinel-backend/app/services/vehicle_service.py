import uuid
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.vehicle import Vehicle
from app.repositories.vehicle_repository import VehicleRepository
from app.core.exceptions import NotFoundException


class VehicleService:
    def __init__(self, session: AsyncSession):
        self.vehicle_repo = VehicleRepository(session)

    async def get_by_id(self, vehicle_id: uuid.UUID) -> Vehicle:
        vehicle = await self.vehicle_repo.get_by_id(vehicle_id)
        if not vehicle:
            raise NotFoundException(resource="Vehicle", identifier=vehicle_id)
        return vehicle
