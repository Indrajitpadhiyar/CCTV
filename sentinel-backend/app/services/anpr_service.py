import uuid
from datetime import datetime
from typing import Optional, List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.license_plate import LicensePlate
from app.repositories.vehicle_repository import VehicleRepository
from app.repositories.watchlist_repository import WatchlistRepository
from app.repositories.alert_repository import AlertRepository
from app.models.alert import Alert
from app.events.publisher import EventPublisher
from app.events.event_types import EventType
from app.schemas.anpr import VehiclePlateSearchResponse, ANPRDetectionPoint


class ANPRService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.vehicle_repo = VehicleRepository(session)
        self.watchlist_repo = WatchlistRepository(session)
        self.alert_repo = AlertRepository(session)

    async def search_by_plate(
        self,
        plate_number: str,
        camera_id: Optional[uuid.UUID] = None,
        district: Optional[str] = None,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None
    ) -> VehiclePlateSearchResponse:
        records = await self.vehicle_repo.search_by_plate(
            plate_number=plate_number,
            exact_match=False,
            camera_id=camera_id,
            district=district,
            start_time=start_time,
            end_time=end_time
        )
        
        points = []
        for lp, cam in records:
            points.append(ANPRDetectionPoint(
                detection_id=lp.id,
                camera_id=cam.id,
                camera_code=cam.camera_code,
                location_name=cam.location_name,
                timestamp=lp.timestamp,
                latitude=cam.latitude,
                longitude=cam.longitude,
                confidence=lp.confidence
            ))

        return VehiclePlateSearchResponse(
            plate_number=plate_number.upper(),
            total_detections=len(points),
            detections=points
        )

    async def process_anpr_detection(
        self,
        camera_id: uuid.UUID,
        plate_number: str,
        confidence: float,
        timestamp: Optional[datetime] = None
    ) -> LicensePlate:
        lp = LicensePlate(
            camera_id=camera_id,
            plate_number=plate_number.upper(),
            confidence=confidence,
            timestamp=timestamp or datetime.utcnow()
        )
        saved_lp = await self.vehicle_repo.create_license_plate(lp)

        # Broadcast ANPR detection event
        await EventPublisher.publish(
            EventType.ANPR_DETECTED,
            {
                "id": str(saved_lp.id),
                "camera_id": str(camera_id),
                "plate_number": saved_lp.plate_number,
                "confidence": confidence
            }
        )

        # Check against active Watchlists
        watchlist_match = await self.watchlist_repo.find_matching_active(saved_lp.plate_number, "VEHICLE_PLATE")
        if watchlist_match:
            alert = Alert(
                type="VEHICLE_WATCHLIST",
                severity=watchlist_match.priority,
                status="NEW",
                camera_id=camera_id,
                title=f"Watchlist vehicle detected: {saved_lp.plate_number}",
                description=f"Matched watchlist item: {watchlist_match.description or 'Target vehicle plate'}",
                extra_metadata={
                    "plate_number": saved_lp.plate_number,
                    "watchlist_id": str(watchlist_match.id),
                    "confidence": confidence
                }
            )
            created_alert = await self.alert_repo.create(alert)

            # Broadcast Alert created event to WebSocket
            await EventPublisher.publish(
                EventType.ALERT_CREATED,
                {
                    "alert_id": str(created_alert.id),
                    "severity": created_alert.severity,
                    "camera_id": str(camera_id),
                    "title": created_alert.title,
                    "plate_number": saved_lp.plate_number
                }
            )

        return saved_lp
