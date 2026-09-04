from app.workers.celery_app import celery_app
from app.core.logging import logger


@celery_app.task
def run_tracking(detection_id: str):
    """Celery task to update multi-camera trajectory tracking."""
    logger.info(f"Updating tracking trajectory for detection {detection_id}")
    return {"detection_id": detection_id, "track_updated": True}
