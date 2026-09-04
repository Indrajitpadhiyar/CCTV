from app.schemas.response import StandardResponse, PaginatedResponse
from app.schemas.auth import Token, TokenPayload, UserRegister, UserLogin
from app.schemas.user import UserRead, RoleRead, UserUpdate
from app.schemas.camera import CameraCreate, CameraUpdate, CameraRead, CameraGISMapPoint, CameraStats
from app.schemas.stream import StreamCreate, StreamUpdate, StreamRead
from app.schemas.detection import DetectionCreate, DetectionRead
from app.schemas.vehicle import VehicleRead
from app.schemas.anpr import LicensePlateRead, VehiclePlateSearchResponse, ANPRDetectionPoint
from app.schemas.person import PersonRead, PersonSearchRequest, PersonSearchMatch
from app.schemas.tracking import VehicleTrajectoryResponse, TrajectoryPoint, TrackRead
from app.schemas.alert import AlertCreate, AlertUpdate, AlertRead
from app.schemas.watchlist import WatchlistCreate, WatchlistUpdate, WatchlistRead
from app.schemas.event import EventRead
from app.schemas.evidence import EvidenceCreate, EvidenceRead
from app.schemas.search import UnifiedSearchResponse, SearchResultItem
from app.schemas.analytics import OverviewAnalytics, DetailedAnalyticsResponse

__all__ = [
    "StandardResponse", "PaginatedResponse",
    "Token", "TokenPayload", "UserRegister", "UserLogin",
    "UserRead", "RoleRead", "UserUpdate",
    "CameraCreate", "CameraUpdate", "CameraRead", "CameraGISMapPoint", "CameraStats",
    "StreamCreate", "StreamUpdate", "StreamRead",
    "DetectionCreate", "DetectionRead",
    "VehicleRead",
    "LicensePlateRead", "VehiclePlateSearchResponse", "ANPRDetectionPoint",
    "PersonRead", "PersonSearchRequest", "PersonSearchMatch",
    "VehicleTrajectoryResponse", "TrajectoryPoint", "TrackRead",
    "AlertCreate", "AlertUpdate", "AlertRead",
    "WatchlistCreate", "WatchlistUpdate", "WatchlistRead",
    "EventRead",
    "EvidenceCreate", "EvidenceRead",
    "UnifiedSearchResponse", "SearchResultItem",
    "OverviewAnalytics", "DetailedAnalyticsResponse"
]
