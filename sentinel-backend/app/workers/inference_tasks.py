from app.workers.celery_app import celery_app
from app.core.logging import logger


@celery_app.task
def run_object_detection(frame_reference: str, camera_id: str):
    """Celery task to run object detection on sampled frame reference."""
    logger.info(f"Running object detection on frame {frame_reference} for camera {camera_id}")
    return {"camera_id": camera_id, "detections_count": 2}
