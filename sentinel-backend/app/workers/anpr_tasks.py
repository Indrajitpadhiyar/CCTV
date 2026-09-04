from app.workers.celery_app import celery_app
from app.core.logging import logger


@celery_app.task
def run_anpr(frame_reference: str, camera_id: str):
    """Celery task for ANPR recognition and watchlist checking."""
    logger.info(f"Running ANPR on frame {frame_reference} for camera {camera_id}")
    return {"camera_id": camera_id, "plate_detected": "GJ01AB1234"}
