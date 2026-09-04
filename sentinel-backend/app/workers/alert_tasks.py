from app.workers.celery_app import celery_app
from app.core.logging import logger


@celery_app.task
def process_alert(alert_id: str):
    """Celery task to handle alert notification routing."""
    logger.info(f"Processing notification pipeline for alert {alert_id}")
    return {"alert_id": alert_id, "sent": True}
