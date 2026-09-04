from typing import AsyncGenerator
import redis.asyncio as redis
from app.core.config import settings

redis_pool = redis.ConnectionPool.from_url(
    settings.REDIS_URL,
    decode_responses=True,
    max_connections=50
)


async def get_redis_client() -> redis.Redis:
    """Returns an async Redis client from connection pool."""
    return redis.Redis(connection_pool=redis_pool)


async def get_redis() -> AsyncGenerator[redis.Redis, None]:
    """FastAPI Dependency for acquiring async Redis connection."""
    client = await get_redis_client()
    try:
        yield client
    finally:
        await client.close()
