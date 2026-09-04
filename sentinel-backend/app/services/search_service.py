import uuid
from datetime import datetime
from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.camera import Camera
from app.models.license_plate import LicensePlate
from app.models.alert import Alert
from app.models.event import Event
from app.schemas.search import UnifiedSearchResponse, SearchResultItem


class SearchService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def search(
        self,
        query: str,
        camera_id: Optional[uuid.UUID] = None,
        district: Optional[str] = None,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None
    ) -> UnifiedSearchResponse:
        results: List[SearchResultItem] = []
        q_pattern = f"%{query}%"

        # Search Cameras
        cam_stmt = select(Camera).where(Camera.name.ilike(q_pattern) | Camera.camera_code.ilike(q_pattern))
        if district:
            cam_stmt = cam_stmt.where(Camera.district == district)
        cams = (await self.session.execute(cam_stmt)).scalars().all()
        for c in cams:
            results.append(SearchResultItem(
                id=c.id,
                entity_type="camera",
                title=f"Camera: {c.name} ({c.camera_code})",
                description=f"Status: {c.status}, Zone: {c.zone}",
                camera_id=c.id
            ))

        # Search License Plates
        lp_stmt = select(LicensePlate).where(LicensePlate.plate_number.ilike(q_pattern))
        if camera_id:
            lp_stmt = lp_stmt.where(LicensePlate.camera_id == camera_id)
        if start_time:
            lp_stmt = lp_stmt.where(LicensePlate.timestamp >= start_time)
        if end_time:
            lp_stmt = lp_stmt.where(LicensePlate.timestamp <= end_time)
        lps = (await self.session.execute(lp_stmt.limit(20))).scalars().all()
        for lp in lps:
            results.append(SearchResultItem(
                id=lp.id,
                entity_type="license_plate",
                title=f"ANPR Plate: {lp.plate_number}",
                description=f"Confidence: {lp.confidence}",
                camera_id=lp.camera_id,
                timestamp=lp.timestamp
            ))

        # Search Alerts
        alert_stmt = select(Alert).where(Alert.title.ilike(q_pattern) | Alert.type.ilike(q_pattern))
        if camera_id:
            alert_stmt = alert_stmt.where(Alert.camera_id == camera_id)
        alerts = (await self.session.execute(alert_stmt.limit(20))).scalars().all()
        for a in alerts:
            results.append(SearchResultItem(
                id=a.id,
                entity_type="alert",
                title=f"Alert [{a.severity}]: {a.title}",
                description=a.description,
                camera_id=a.camera_id,
                timestamp=a.timestamp
            ))

        return UnifiedSearchResponse(
            query=query,
            total_results=len(results),
            results=results
        )
