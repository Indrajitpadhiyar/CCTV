import json
from typing import Any, Dict
import redis.asyncio as redis
from app.core.redis import get_redis_client
from app.core.logging import logger

SENTINEL_EVENTS_CHANNEL = "sentinel:events"


class EventPublisher:
    """Publishes domain events to Redis Pub/Sub channel."""

    @staticmethod
    async def publish(event_type: str, data: Dict[str, Any]) -> bool:
        try:
            client = await get_redis_client()
            message = {
                "event": event_type,
                "timestamp": data.get("timestamp"),
                "data": data
            }
            payload = json.dumps(message)
            await client.publish(SENTINEL_EVENTS_CHANNEL, payload)
            await client.close()
            return True
        except Exception as e:
            logger.error(f"Failed to publish event {event_type} to Redis: {e}")
            return False
