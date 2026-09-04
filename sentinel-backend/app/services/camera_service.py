import uuid
from typing import Optional, List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.camera import Camera
from app.repositories.camera_repository import CameraRepository
from app.schemas.camera import CameraCreate, CameraUpdate
from app.video.stream_manager import stream_manager
from app.events.publisher import EventPublisher
from app.events.event_types import EventType
from app.core.exceptions import NotFoundException, ConflictException


class CameraService:
    def __init__(self, session: AsyncSession):
        self.camera_repo = CameraRepository(session)

    async def create_camera(self, payload: CameraCreate) -> Camera:
        existing = await self.camera_repo.get_by_code(payload.camera_code)
        if existing:
            raise ConflictException(f"Camera with code '{payload.camera_code}' already exists")

        camera = Camera(**payload.model_dump())
        created = await self.camera_repo.create(camera)
        
        await EventPublisher.publish(
            EventType.CAMERA_STATUS,
            {"camera_id": str(created.id), "status": created.status, "camera_code": created.camera_code}
        )
        return created

    async def get_by_id(self, camera_id: uuid.UUID) -> Camera:
        camera = await self.camera_repo.get_by_id(camera_id)
        if not camera:
            raise NotFoundException(resource="Camera", identifier=camera_id)
        return camera

    async def list_cameras(
        self,
        page: int = 1,
        page_size: int = 50,
        status: Optional[str] = None,
        district: Optional[str] = None,
        zone: Optional[str] = None,
        vendor: Optional[str] = None,
        protocol: Optional[str] = None,
        search: Optional[str] = None
    ) -> Tuple[List[Camera], int]:
        skip = (page - 1) * page_size
        return await self.camera_repo.list_cameras(
            skip=skip,
            limit=page_size,
            status=status,
            district=district,
            zone=zone,
            vendor=vendor,
            protocol=protocol,
            search=search
        )

    async def update_camera(self, camera_id: uuid.UUID, payload: CameraUpdate) -> Camera:
        camera = await self.get_by_id(camera_id)
        update_data = payload.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(camera, key, value)
        await self.camera_repo.session.flush()
        await self.camera_repo.session.refresh(camera)
        return camera

    async def delete_camera(self, camera_id: uuid.UUID) -> bool:
        await self.get_by_id(camera_id)
        stream_manager.stop_stream(str(camera_id))
        return await self.camera_repo.delete(camera_id)

    async def start_camera_stream(self, camera_id: uuid.UUID) -> bool:
        camera = await self.get_by_id(camera_id)
        success = stream_manager.start_stream(str(camera_id), camera.rtsp_url)
        if success:
            camera.status = "online"
            await self.camera_repo.session.flush()
            await EventPublisher.publish(
                EventType.CAMERA_STATUS,
                {"camera_id": str(camera_id), "status": "online"}
            )
        return success

    async def stop_camera_stream(self, camera_id: uuid.UUID) -> bool:
        camera = await self.get_by_id(camera_id)
        success = stream_manager.stop_stream(str(camera_id))
        camera.status = "offline"
        await self.camera_repo.session.flush()
        await EventPublisher.publish(
            EventType.CAMERA_OFFLINE,
            {"camera_id": str(camera_id), "status": "offline"}
        )
        return True

    async def restart_camera_stream(self, camera_id: uuid.UUID) -> bool:
        await self.stop_camera_stream(camera_id)
        return await self.start_camera_stream(camera_id)

    async def get_stats(self) -> dict:
        return await self.camera_repo.get_stats()

    async def get_gis_map_points(self) -> List[Camera]:
        return await self.camera_repo.get_gis_points()
