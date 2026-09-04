import json
from typing import Callable, Awaitable
import redis.asyncio as redis
from app.core.redis import get_redis_client
from app.events.publisher import SENTINEL_EVENTS_CHANNEL
from app.core.logging import logger


class EventSubscriber:
    """Subscribes to Redis Pub/Sub channel and forwards to callbacks (WebSocket broadcaster)."""

    def __init__(self):
        self.pubsub = None

    async def start_listening(self, callback: Callable[[dict], Awaitable[None]]):
        client = await get_redis_client()
        self.pubsub = client.pubsub()
        await self.pubsub.subscribe(SENTINEL_EVENTS_CHANNEL)
        logger.info(f"Subscribed to Redis channel: {SENTINEL_EVENTS_CHANNEL}")

        try:
            async for message in self.pubsub.listen():
                if message["type"] == "message":
                    payload = json.loads(message["data"])
                    await callback(payload)
        except Exception as e:
            logger.error(f"Error in EventSubscriber listener loop: {e}")
        finally:
            await self.pubsub.unsubscribe(SENTINEL_EVENTS_CHANNEL)
            await client.close()
