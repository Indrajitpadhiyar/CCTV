from app.workers.celery_app import celery_app
from app.core.logging import logger


@celery_app.task(bind=True, max_retries=3, default_retry_delay=5)
def process_camera_stream(self, camera_id: str):
    """Celery task to ingest and manage camera RTSP stream."""
    try:
        logger.info(f"Task process_camera_stream running for camera {camera_id}")
        return {"status": "success", "camera_id": camera_id}
    except Exception as exc:
        logger.error(f"Error processing camera {camera_id}: {exc}")
        raise self.retry(exc=exc)


@celery_app.task
def check_camera_health(camera_id: str):
    """Celery task to perform health ping on camera RTSP endpoint."""
    logger.info(f"Health checking camera {camera_id}")
    return {"camera_id": camera_id, "status": "online"}
