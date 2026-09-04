from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.cameras import router as cameras_router
from app.api.v1.streams import router as streams_router
from app.api.v1.detections import router as detections_router
from app.api.v1.vehicles import router as vehicles_router
from app.api.v1.persons import router as persons_router
from app.api.v1.anpr import router as anpr_router
from app.api.v1.tracking import router as tracking_router
from app.api.v1.alerts import router as alerts_router
from app.api.v1.watchlists import router as watchlists_router
from app.api.v1.events import router as events_router
from app.api.v1.evidence import router as evidence_router
from app.api.v1.search import router as search_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.locations import router as locations_router
from app.api.v1.health import router as health_router
from app.api.v1.websocket import router as ws_router

api_v1_router = APIRouter(prefix="/api/v1")

api_v1_router.include_router(auth_router)
api_v1_router.include_router(users_router)
api_v1_router.include_router(cameras_router)
api_v1_router.include_router(streams_router)
api_v1_router.include_router(detections_router)
api_v1_router.include_router(vehicles_router)
api_v1_router.include_router(persons_router)
api_v1_router.include_router(anpr_router)
api_v1_router.include_router(tracking_router)
api_v1_router.include_router(alerts_router)
api_v1_router.include_router(watchlists_router)
api_v1_router.include_router(events_router)
api_v1_router.include_router(evidence_router)
api_v1_router.include_router(search_router)
api_v1_router.include_router(analytics_router)
api_v1_router.include_router(locations_router)
api_v1_router.include_router(health_router)
api_v1_router.include_router(ws_router)
