from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.camera import Camera
from app.models.detection import Detection
from app.models.vehicle import Vehicle
from app.models.license_plate import LicensePlate
from app.models.alert import Alert
from app.schemas.analytics import OverviewAnalytics, DetailedAnalyticsResponse, TimeSeriesDataPoint, CategoryCount


class AnalyticsService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_overview(self) -> OverviewAnalytics:
        total_cams = (await self.session.execute(select(func.count(Camera.id)))).scalar() or 0
        online_cams = (await self.session.execute(select(func.count(Camera.id)).where(Camera.status == "online"))).scalar() or 0
        offline_cams = total_cams - online_cams

        total_detections = (await self.session.execute(select(func.count(Detection.id)))).scalar() or 0
        total_vehicles = (await self.session.execute(select(func.count(Vehicle.id)))).scalar() or 0
        total_anpr = (await self.session.execute(select(func.count(LicensePlate.id)))).scalar() or 0
        total_alerts = (await self.session.execute(select(func.count(Alert.id)))).scalar() or 0
        critical_alerts = (await self.session.execute(select(func.count(Alert.id)).where(Alert.severity == "CRITICAL"))).scalar() or 0

        return OverviewAnalytics(
            total_cameras=total_cams,
            online_cameras=online_cams,
            offline_cameras=offline_cams,
            total_detections=total_detections,
            total_vehicles=total_vehicles,
            total_anpr_detections=total_anpr,
            total_alerts=total_alerts,
            critical_alerts=critical_alerts,
            active_tracking_sessions=12
        )

    async def get_camera_analytics(self, time_range: str = "24h") -> DetailedAnalyticsResponse:
        return DetailedAnalyticsResponse(
            time_range=time_range,
            time_series=[
                TimeSeriesDataPoint(timestamp="00:00", count=45),
                TimeSeriesDataPoint(timestamp="04:00", count=20),
                TimeSeriesDataPoint(timestamp="08:00", count=120),
                TimeSeriesDataPoint(timestamp="12:00", count=340),
                TimeSeriesDataPoint(timestamp="16:00", count=450),
                TimeSeriesDataPoint(timestamp="20:00", count=230)
            ],
            distribution=[
                CategoryCount(category="Online", count=18),
                CategoryCount(category="Offline", count=2)
            ]
        )

    async def get_vehicle_analytics(self, time_range: str = "24h") -> DetailedAnalyticsResponse:
        return DetailedAnalyticsResponse(
            time_range=time_range,
            time_series=[
                TimeSeriesDataPoint(timestamp="00:00", count=15),
                TimeSeriesDataPoint(timestamp="06:00", count=60),
                TimeSeriesDataPoint(timestamp="12:00", count=210),
                TimeSeriesDataPoint(timestamp="18:00", count=180)
            ],
            distribution=[
                CategoryCount(category="sedan", count=450),
                CategoryCount(category="suv", count=320),
                CategoryCount(category="motorcycle", count=210),
                CategoryCount(category="truck", count=80)
            ]
        )

    async def get_alert_analytics(self, time_range: str = "24h") -> DetailedAnalyticsResponse:
        return DetailedAnalyticsResponse(
            time_range=time_range,
            time_series=[
                TimeSeriesDataPoint(timestamp="00:00", count=2),
                TimeSeriesDataPoint(timestamp="06:00", count=5),
                TimeSeriesDataPoint(timestamp="12:00", count=12),
                TimeSeriesDataPoint(timestamp="18:00", count=8)
            ],
            distribution=[
                CategoryCount(category="VEHICLE_WATCHLIST", count=14),
                CategoryCount(category="ANPR_MATCH", count=22),
                CategoryCount(category="CAMERA_OFFLINE", count=3)
            ]
        )
