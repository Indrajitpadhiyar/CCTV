from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.analytics import OverviewAnalytics, DetailedAnalyticsResponse
from app.schemas.response import StandardResponse
from app.services.analytics_service import AnalyticsService
from app.api.deps import require_role
from app.models.user import User

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/overview", response_model=StandardResponse[OverviewAnalytics])
async def get_overview_analytics(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR", "INVESTIGATOR", "VIEWER"))
):
    service = AnalyticsService(db)
    overview = await service.get_overview()
    return StandardResponse(data=overview, message="System overview metrics retrieved")


@router.get("/cameras", response_model=StandardResponse[DetailedAnalyticsResponse])
async def get_camera_analytics(
    time_range: str = Query("24h", description="1h, 6h, 24h, 7d, 30d"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR", "INVESTIGATOR", "VIEWER"))
):
    service = AnalyticsService(db)
    res = await service.get_camera_analytics(time_range)
    return StandardResponse(data=res, message="Camera analytics retrieved")


@router.get("/vehicles", response_model=StandardResponse[DetailedAnalyticsResponse])
async def get_vehicle_analytics(
    time_range: str = Query("24h", description="1h, 6h, 24h, 7d, 30d"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR", "INVESTIGATOR", "VIEWER"))
):
    service = AnalyticsService(db)
    res = await service.get_vehicle_analytics(time_range)
    return StandardResponse(data=res, message="Vehicle analytics retrieved")


@router.get("/alerts", response_model=StandardResponse[DetailedAnalyticsResponse])
async def get_alert_analytics(
    time_range: str = Query("24h", description="1h, 6h, 24h, 7d, 30d"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR", "INVESTIGATOR", "VIEWER"))
):
    service = AnalyticsService(db)
    res = await service.get_alert_analytics(time_range)
    return StandardResponse(data=res, message="Alert analytics retrieved")
