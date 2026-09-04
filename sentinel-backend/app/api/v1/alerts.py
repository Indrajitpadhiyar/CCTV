import uuid
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.alert import AlertRead, AlertCreate, AlertUpdate
from app.schemas.response import StandardResponse, PaginatedResponse
from app.services.alert_service import AlertService
from app.utils.pagination import paginate
from app.api.deps import require_role
from app.models.user import User

router = APIRouter(prefix="/alerts", tags=["Alerts"])


@router.get("", response_model=StandardResponse[PaginatedResponse[AlertRead]])
async def list_alerts(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    camera_id: Optional[uuid.UUID] = None,
    type: Optional[str] = Query(None, alias="type"),
    severity: Optional[str] = None,
    status: Optional[str] = None,
    start_time: Optional[datetime] = None,
    end_time: Optional[datetime] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR", "INVESTIGATOR", "VIEWER"))
):
    service = AlertService(db)
    alerts, total = await service.list_alerts(
        page=page,
        page_size=page_size,
        camera_id=camera_id,
        alert_type=type,
        severity=severity,
        status=status,
        start_time=start_time,
        end_time=end_time
    )
    paginated = paginate(alerts, total, page, page_size)
    return StandardResponse(data=paginated, message="Alerts retrieved")


@router.get("/{alert_id}", response_model=StandardResponse[AlertRead])
async def get_alert(
    alert_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR", "INVESTIGATOR", "VIEWER"))
):
    service = AlertService(db)
    alert = await service.get_by_id(alert_id)
    return StandardResponse(data=alert, message="Alert details retrieved")


@router.patch("/{alert_id}", response_model=StandardResponse[AlertRead])
async def update_alert(
    alert_id: uuid.UUID,
    payload: AlertUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR"))
):
    service = AlertService(db)
    alert = await service.get_by_id(alert_id)
    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(alert, key, value)
    await db.flush()
    await db.refresh(alert)
    return StandardResponse(data=alert, message="Alert updated successfully")


@router.post("/{alert_id}/acknowledge", response_model=StandardResponse[AlertRead])
async def acknowledge_alert(
    alert_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR"))
):
    service = AlertService(db)
    alert = await service.acknowledge_alert(alert_id, current_user.id)
    return StandardResponse(data=alert, message="Alert acknowledged")
