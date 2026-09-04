import uuid
from typing import Optional, List, Tuple
from sqlalchemy import select, func, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.camera import Camera


class CameraRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, camera_id: uuid.UUID) -> Optional[Camera]:
        stmt = select(Camera).where(Camera.id == camera_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_code(self, camera_code: str) -> Optional[Camera]:
        stmt = select(Camera).where(Camera.camera_code == camera_code)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def list_cameras(
        self,
        skip: int = 0,
        limit: int = 50,
        status: Optional[str] = None,
        district: Optional[str] = None,
        zone: Optional[str] = None,
        vendor: Optional[str] = None,
        protocol: Optional[str] = None,
        search: Optional[str] = None
    ) -> Tuple[List[Camera], int]:
        stmt = select(Camera)
        count_stmt = select(func.count(Camera.id))

        if status:
            stmt = stmt.where(Camera.status == status)
            count_stmt = count_stmt.where(Camera.status == status)
        if district:
            stmt = stmt.where(Camera.district == district)
            count_stmt = count_stmt.where(Camera.district == district)
        if zone:
            stmt = stmt.where(Camera.zone == zone)
            count_stmt = count_stmt.where(Camera.zone == zone)
        if vendor:
            stmt = stmt.where(Camera.vendor == vendor)
            count_stmt = count_stmt.where(Camera.vendor == vendor)
        if protocol:
            stmt = stmt.where(Camera.protocol == protocol)
            count_stmt = count_stmt.where(Camera.protocol == protocol)
        if search:
            search_pattern = f"%{search}%"
            stmt = stmt.where(Camera.name.ilike(search_pattern) | Camera.camera_code.ilike(search_pattern))
            count_stmt = count_stmt.where(Camera.name.ilike(search_pattern) | Camera.camera_code.ilike(search_pattern))

        total = (await self.session.execute(count_stmt)).scalar() or 0
        stmt = stmt.order_by(Camera.created_at.desc()).offset(skip).limit(limit)
        cameras = (await self.session.execute(stmt)).scalars().all()
        return list(cameras), total

    async def create(self, camera: Camera) -> Camera:
        self.session.add(camera)
        await self.session.flush()
        await self.session.refresh(camera)
        return camera

    async def delete(self, camera_id: uuid.UUID) -> bool:
        stmt = delete(Camera).where(Camera.id == camera_id)
        result = await self.session.execute(stmt)
        return result.rowcount > 0

    async def get_stats(self) -> dict:
        total = (await self.session.execute(select(func.count(Camera.id)))).scalar() or 0
        online = (await self.session.execute(select(func.count(Camera.id)).where(Camera.status == "online"))).scalar() or 0
        offline = (await self.session.execute(select(func.count(Camera.id)).where(Camera.status == "offline"))).scalar() or 0
        degraded = (await self.session.execute(select(func.count(Camera.id)).where(Camera.status == "degraded"))).scalar() or 0
        return {
            "total_cameras": total,
            "online_cameras": online,
            "offline_cameras": offline,
            "degraded_cameras": degraded
        }

    async def get_gis_points(self) -> List[Camera]:
        stmt = select(Camera).where(Camera.latitude.isnot(None), Camera.longitude.isnot(None))
        result = await self.session.execute(stmt)
        return list(result.scalars().all())
