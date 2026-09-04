from typing import Dict, Any, List
from pydantic import BaseModel


class OverviewAnalytics(BaseModel):
    total_cameras: int
    online_cameras: int
    offline_cameras: int
    total_detections: int
    total_vehicles: int
    total_anpr_detections: int
    total_alerts: int
    critical_alerts: int
    active_tracking_sessions: int


class TimeSeriesDataPoint(BaseModel):
    timestamp: str
    count: int


class CategoryCount(BaseModel):
    category: str
    count: int


class DetailedAnalyticsResponse(BaseModel):
    time_range: str
    time_series: List[TimeSeriesDataPoint]
    distribution: List[CategoryCount]
