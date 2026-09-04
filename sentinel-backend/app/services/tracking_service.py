import uuid
from datetime import datetime
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.vehicle_repository import VehicleRepository
from app.schemas.tracking import VehicleTrajectoryResponse, TrajectoryPoint


class TrackingService:
    def __init__(self, session: AsyncSession):
        self.vehicle_repo = VehicleRepository(session)

    async def get_vehicle_trajectory(
        self,
        plate_number: str,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None
    ) -> VehicleTrajectoryResponse:
        records = await self.vehicle_repo.search_by_plate(
            plate_number=plate_number,
            exact_match=True,
            start_time=start_time,
            end_time=end_time
        )

        timeline = []
        for lp, cam in records:
            timeline.append(TrajectoryPoint(
                camera_id=cam.id,
                camera_code=cam.camera_code,
                location_name=cam.location_name,
                timestamp=lp.timestamp,
                latitude=cam.latitude,
                longitude=cam.longitude,
                confidence=lp.confidence
            ))

        # Sort chronologically (oldest to newest for trajectory)
        timeline.sort(key=lambda x: x.timestamp)

        vehicle_id = str(records[0][0].vehicle_id) if records and records[0][0].vehicle_id else None

        return VehicleTrajectoryResponse(
            vehicle_id=vehicle_id,
            plate_number=plate_number.upper(),
            timeline=timeline
        )
