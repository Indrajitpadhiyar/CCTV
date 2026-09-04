import httpx
from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.camera_repository import CameraRepository
from app.models.camera import Camera
from app.core.config import settings
from app.core.logging import logger


class CatalogService:
    """Service to fetch and synchronize live camera catalogue from https://cctv.corp8.cloud/cameras.json."""

    def __init__(self, session: AsyncSession):
        self.session = session
        self.camera_repo = CameraRepository(session)

    async def fetch_remote_catalog(self) -> List[Dict[str, Any]]:
        """Fetch camera catalogue JSON from external endpoint."""
        logger.info(f"Fetching camera catalogue from: {settings.CCTV_CATALOG_URL}")
        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                response = await client.get(settings.CCTV_CATALOG_URL)
                response.raise_for_status()
                data = response.json()
                if isinstance(data, list):
                    return data
                elif isinstance(data, dict) and "cameras" in data:
                    return data["cameras"]
                else:
                    logger.warning("Unexpected catalog response format, using default cam01-cam30 range fallback.")
                    return [{"id": f"cam{i:02d}"} for i in range(1, 31)]
            except Exception as e:
                logger.error(f"Error fetching remote catalog: {e}. Falling back to default cam01-cam30 catalogue.")
                return [{"id": f"cam{i:02d}"} for i in range(1, 31)]

    async def sync_catalog(self) -> List[Camera]:
        """Fetch catalogue and insert or update cameras in Supabase / PostgreSQL database."""
        remote_cameras = await self.fetch_remote_catalog()
        synced_cameras: List[Camera] = []

        for item in remote_cameras:
            cam_id = item.get("id") or item.get("camera_id") or item.get("code")
            if not cam_id:
                continue

            cam_code = str(cam_id).strip()
            name = item.get("name") or f"Camera {cam_code.upper()}"
            hls_url = f"{settings.CCTV_HLS_BASE_URL}/{cam_code}/index.m3u8"
            
            # Format RTSP URL if credentials set
            if settings.CCTV_STREAM_USER and settings.CCTV_STREAM_PASSWORD:
                user = settings.CCTV_STREAM_USER.replace("@", "%40")
                pwd = settings.CCTV_STREAM_PASSWORD.replace("@", "%40")
                rtsp_url = f"rtsp://{user}:{pwd}@{settings.CCTV_RTSP_HOST}:{settings.CCTV_RTSP_PORT}/stream/{cam_code}"
            else:
                rtsp_url = hls_url  # Fallback to public HLS URL

            existing = await self.camera_repo.get_by_code(cam_code)
            if existing:
                existing.name = name
                existing.rtsp_url = rtsp_url
                existing.status = "online"
                synced_cameras.append(existing)
            else:
                new_camera = Camera(
                    camera_code=cam_code,
                    name=name,
                    protocol="RTSP" if rtsp_url.startswith("rtsp://") else "HLS",
                    rtsp_url=rtsp_url,
                    status="online",
                    location_name=f"Zone {cam_code.upper()}",
                    district="Central",
                    zone="Zone-1",
                    state="Active",
                    fps=25,
                    resolution="1920x1080"
                )
                created = await self.camera_repo.create(new_camera)
                synced_cameras.append(created)

        await self.session.commit()
        logger.info(f"Synchronized {len(synced_cameras)} cameras from live catalog into database.")
        return synced_cameras
