import uuid
from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from app.models.role import Role


class UserRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, user_id: uuid.UUID) -> Optional[User]:
        stmt = select(User).where(User.id == user_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> Optional[User]:
        stmt = select(User).where(User.email == email)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_username(self, username: str) -> Optional[User]:
        stmt = select(User).where(User.username == username)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_role_by_name(self, role_name: str) -> Optional[Role]:
        stmt = select(Role).where(Role.name == role_name)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def create_user(self, user: User) -> User:
        self.session.add(user)
        await self.session.flush()
        await self.session.refresh(user)
        return user
