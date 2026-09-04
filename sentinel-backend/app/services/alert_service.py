import uuid
from datetime import datetime
from typing import Optional, List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.alert import Alert
from app.repositories.alert_repository import AlertRepository
from app.schemas.alert import AlertCreate, AlertUpdate
from app.events.publisher import EventPublisher
from app.events.event_types import EventType
from app.core.exceptions import NotFoundException


class AlertService:
    def __init__(self, session: AsyncSession):
        self.alert_repo = AlertRepository(session)

    async def create_alert(self, payload: AlertCreate) -> Alert:
        alert = Alert(**payload.model_dump())
        created = await self.alert_repo.create(alert)

        await EventPublisher.publish(
            EventType.ALERT_CREATED,
            {
                "alert_id": str(created.id),
                "severity": created.severity,
                "camera_id": str(created.camera_id) if created.camera_id else None,
                "title": created.title
            }
        )
        return created

    async def get_by_id(self, alert_id: uuid.UUID) -> Alert:
        alert = await self.alert_repo.get_by_id(alert_id)
        if not alert:
            raise NotFoundException(resource="Alert", identifier=alert_id)
        return alert

    async def list_alerts(
        self,
        page: int = 1,
        page_size: int = 50,
        camera_id: Optional[uuid.UUID] = None,
        alert_type: Optional[str] = None,
        severity: Optional[str] = None,
        status: Optional[str] = None,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None
    ) -> Tuple[List[Alert], int]:
        skip = (page - 1) * page_size
        return await self.alert_repo.list_alerts(
            skip=skip,
            limit=page_size,
            camera_id=camera_id,
            alert_type=alert_type,
            severity=severity,
            status=status,
            start_time=start_time,
            end_time=end_time
        )

    async def acknowledge_alert(self, alert_id: uuid.UUID, user_id: uuid.UUID) -> Alert:
        alert = await self.alert_repo.acknowledge(alert_id, user_id)
        if not alert:
            raise NotFoundException(resource="Alert", identifier=alert_id)
        
        await EventPublisher.publish(
            EventType.ALERT_UPDATED,
            {"alert_id": str(alert.id), "status": alert.status}
        )
        return alert
