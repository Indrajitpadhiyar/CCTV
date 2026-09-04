import uuid
from datetime import datetime
from typing import Optional, List, Tuple
from sqlalchemy import select, func, update
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.alert import Alert


class AlertRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, alert_id: uuid.UUID) -> Optional[Alert]:
        stmt = select(Alert).where(Alert.id == alert_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def list_alerts(
        self,
        skip: int = 0,
        limit: int = 50,
        camera_id: Optional[uuid.UUID] = None,
        alert_type: Optional[str] = None,
        severity: Optional[str] = None,
        status: Optional[str] = None,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None
    ) -> Tuple[List[Alert], int]:
        stmt = select(Alert)
        count_stmt = select(func.count(Alert.id))

        if camera_id:
            stmt = stmt.where(Alert.camera_id == camera_id)
            count_stmt = count_stmt.where(Alert.camera_id == camera_id)
        if alert_type:
            stmt = stmt.where(Alert.type == alert_type)
            count_stmt = count_stmt.where(Alert.type == alert_type)
        if severity:
            stmt = stmt.where(Alert.severity == severity)
            count_stmt = count_stmt.where(Alert.severity == severity)
        if status:
            stmt = stmt.where(Alert.status == status)
            count_stmt = count_stmt.where(Alert.status == status)
        if start_time:
            stmt = stmt.where(Alert.timestamp >= start_time)
            count_stmt = count_stmt.where(Alert.timestamp >= start_time)
        if end_time:
            stmt = stmt.where(Alert.timestamp <= end_time)
            count_stmt = count_stmt.where(Alert.timestamp <= end_time)

        total = (await self.session.execute(count_stmt)).scalar() or 0
        stmt = stmt.order_by(Alert.timestamp.desc()).offset(skip).limit(limit)
        alerts = (await self.session.execute(stmt)).scalars().all()
        return list(alerts), total

    async def create(self, alert: Alert) -> Alert:
        self.session.add(alert)
        await self.session.flush()
        await self.session.refresh(alert)
        return alert

    async def acknowledge(self, alert_id: uuid.UUID, user_id: uuid.UUID) -> Optional[Alert]:
        alert = await self.get_by_id(alert_id)
        if alert:
            alert.status = "ACKNOWLEDGED"
            alert.acknowledged_by = user_id
            alert.acknowledged_at = datetime.utcnow()
            await self.session.flush()
            await self.session.refresh(alert)
        return alert
