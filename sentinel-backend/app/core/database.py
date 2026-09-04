from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base

from app.core.config import settings
from app.core.logging import logger

db_url = settings.DATABASE_URL.strip()

# Handle HTTP REST URLs (e.g. Neon REST API) or missing connection string by converting or falling back
if db_url.startswith("http://") or db_url.startswith("https://"):
    logger.warning(f"DATABASE_URL '{db_url}' is a REST API endpoint, not a Postgres TCP connection string.")
    logger.warning("Falling back to local SQLite database: sqlite+aiosqlite:///./sentinel.db")
    db_url = "sqlite+aiosqlite:///./sentinel.db"

engine_kwargs = {
    "echo": settings.DEBUG,
    "future": True,
}

if "sqlite" not in db_url:
    engine_kwargs.update({
        "pool_size": 20,
        "max_overflow": 40,
        "pool_pre_ping": True
    })

engine = create_async_engine(db_url, **engine_kwargs)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency for acquiring async database sessions."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
