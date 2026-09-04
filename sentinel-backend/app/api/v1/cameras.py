import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.camera import CameraCreate, CameraUpdate, CameraRead, CameraGISMapPoint, CameraStats
from app.schemas.response import StandardResponse, PaginatedResponse
from app.services.camera_service import CameraService
from app.services.catalog_service import CatalogService
from app.utils.pagination import paginate
from app.api.deps import require_role
from app.models.user import User

router = APIRouter(prefix="/cameras", tags=["Cameras"])


@router.post("/sync-catalog", response_model=StandardResponse[List[CameraRead]])
async def sync_camera_catalog(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR"))
):
    catalog_service = CatalogService(db)
    cameras = await catalog_service.sync_catalog()
    return StandardResponse(data=cameras, message=f"Successfully synchronized {len(cameras)} cameras from live catalog.")


@router.post("", response_model=StandardResponse[CameraRead], status_code=status.HTTP_201_CREATED)
async def create_camera(
    payload: CameraCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR"))
):
    service = CameraService(db)
    camera = await service.create_camera(payload)
    return StandardResponse(data=camera, message="Camera registered successfully")


@router.get("", response_model=StandardResponse[PaginatedResponse[CameraRead]])
async def list_cameras(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    status: Optional[str] = None,
    district: Optional[str] = None,
    zone: Optional[str] = None,
    vendor: Optional[str] = None,
    protocol: Optional[str] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR", "INVESTIGATOR", "VIEWER"))
):
    service = CameraService(db)
    cameras, total = await service.list_cameras(
        page=page,
        page_size=page_size,
        status=status,
        district=district,
        zone=zone,
        vendor=vendor,
        protocol=protocol,
        search=search
    )
    paginated = paginate(cameras, total, page, page_size)
    return StandardResponse(data=paginated, message="Cameras retrieved")


@router.get("/stats", response_model=StandardResponse[CameraStats])
async def get_camera_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR", "INVESTIGATOR", "VIEWER"))
):
    service = CameraService(db)
    stats = await service.get_stats()
    return StandardResponse(data=CameraStats(**stats), message="Camera statistics retrieved")


@router.get("/map", response_model=StandardResponse[List[CameraGISMapPoint]])
async def get_camera_gis_map(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR", "INVESTIGATOR", "VIEWER"))
):
    service = CameraService(db)
    cams = await service.get_gis_map_points()
    points = [
        CameraGISMapPoint(
            camera_id=c.id,
            camera_code=c.camera_code,
            name=c.name,
            latitude=c.latitude,
            longitude=c.longitude,
            status=c.status,
            zone=c.zone,
            district=c.district
        ) for c in cams if c.latitude and c.longitude
    ]
    return StandardResponse(data=points, message="GIS map points retrieved")


@router.get("/{camera_id}", response_model=StandardResponse[CameraRead])
async def get_camera(
    camera_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR", "INVESTIGATOR", "VIEWER"))
):
    service = CameraService(db)
    camera = await service.get_by_id(camera_id)
    return StandardResponse(data=camera, message="Camera retrieved")


@router.patch("/{camera_id}", response_model=StandardResponse[CameraRead])
async def update_camera(
    camera_id: uuid.UUID,
    payload: CameraUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR"))
):
    service = CameraService(db)
    updated = await service.update_camera(camera_id, payload)
    return StandardResponse(data=updated, message="Camera updated successfully")


@router.delete("/{camera_id}", response_model=StandardResponse[dict])
async def delete_camera(
    camera_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN"))
):
    service = CameraService(db)
    deleted = await service.delete_camera(camera_id)
    return StandardResponse(data={"deleted": deleted}, message="Camera deleted successfully")


@router.post("/{camera_id}/start", response_model=StandardResponse[dict])
async def start_camera_stream(
    camera_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR"))
):
    service = CameraService(db)
    success = await service.start_camera_stream(camera_id)
    return StandardResponse(data={"started": success}, message="Camera stream started")


@router.post("/{camera_id}/stop", response_model=StandardResponse[dict])
async def stop_camera_stream(
    camera_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR"))
):
    service = CameraService(db)
    success = await service.stop_camera_stream(camera_id)
    return StandardResponse(data={"stopped": success}, message="Camera stream stopped")


@router.post("/{camera_id}/restart", response_model=StandardResponse[dict])
async def restart_camera_stream(
    camera_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR"))
):
    service = CameraService(db)
    success = await service.restart_camera_stream(camera_id)
    return StandardResponse(data={"restarted": success}, message="Camera stream restarted")


@router.get("/{camera_id}/health", response_model=StandardResponse[dict])
async def get_camera_health(
    camera_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR", "INVESTIGATOR", "VIEWER"))
):
    service = CameraService(db)
    camera = await service.get_by_id(camera_id)
    return StandardResponse(
        data={"camera_id": camera_id, "status": camera.status, "last_seen_at": camera.last_seen_at},
        message="Camera health status"
    )
