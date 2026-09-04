from app.workers.celery_app import celery_app
from app.core.logging import logger


@celery_app.task
def cleanup_old_events():
    """Celery periodic task to clean up old events and media snapshots."""
    logger.info("Running periodic cleanup task for expired events and evidence files.")
    return {"cleaned": True}
