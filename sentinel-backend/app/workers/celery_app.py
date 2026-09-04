from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "sentinel_workers",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=300,
    worker_max_tasks_per_child=100
)

# Autodiscover worker tasks
celery_app.autodiscover_tasks([
    "app.workers.camera_tasks",
    "app.workers.inference_tasks",
    "app.workers.anpr_tasks",
    "app.workers.tracking_tasks",
    "app.workers.alert_tasks",
    "app.workers.cleanup_tasks",
])
