import pytest
import asyncio
from typing import AsyncGenerator
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.models.base import Base
from app.models.role import Role
from app.models.user import User
from app.core.database import get_db
from app.core.security import hash_password, create_access_token

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

engine = create_async_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(autouse=True)
async def prepare_database():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Create default roles & test admin user
    async with TestingSessionLocal() as session:
        admin_role = Role(name="ADMIN", description="Admin role")
        op_role = Role(name="OPERATOR", description="Operator role")
        session.add_all([admin_role, op_role])
        await session.flush()

        test_admin = User(
            email="admin@test.com",
            username="testadmin",
            password_hash=hash_password("Test1234!"),
            full_name="Test Admin",
            role_id=admin_role.id,
            is_active=True
        )
        session.add(test_admin)
        await session.commit()

    yield

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


async def override_get_db() -> AsyncGenerator[AsyncSession, None]:
    async with TestingSessionLocal() as session:
        yield session


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture
async def client() -> AsyncGenerator[AsyncClient, None]:
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.fixture
async def admin_auth_headers() -> dict:
    async with TestingSessionLocal() as session:
        from sqlalchemy import select
        stmt = select(User).where(User.username == "testadmin")
        user = (await session.execute(stmt)).scalar_one()
        token = create_access_token(subject=user.id, role="ADMIN")
        return {"Authorization": f"Bearer {token}"}
