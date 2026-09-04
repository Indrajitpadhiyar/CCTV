from fastapi import APIRouter, Depends, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.redis import get_redis_client
from app.schemas.response import StandardResponse

router = APIRouter(prefix="/health", tags=["Health Checks"])


@router.get("", response_model=StandardResponse[dict])
async def health_check():
    return StandardResponse(
        data={"status": "healthy", "service": "Sentinel AI CCTV Platform"},
        message="Service is healthy"
    )


@router.get("/database", response_model=StandardResponse[dict])
async def database_health_check(db: AsyncSession = Depends(get_db)):
    try:
        await db.execute(text("SELECT 1"))
        return StandardResponse(
            data={"status": "healthy", "database": "PostgreSQL"},
            message="Database connection established"
        )
    except Exception as e:
        return StandardResponse(
            success=False,
            data={"status": "unhealthy", "error": str(e)},
            message="Database connection failed"
        )


@router.get("/redis", response_model=StandardResponse[dict])
async def redis_health_check():
    try:
        redis_client = await get_redis_client()
        pong = await redis_client.ping()
        await redis_client.close()
        return StandardResponse(
            data={"status": "healthy", "redis_ping": pong},
            message="Redis connection established"
        )
    except Exception as e:
        return StandardResponse(
            success=False,
            data={"status": "unhealthy", "error": str(e)},
            message="Redis connection failed"
        )
