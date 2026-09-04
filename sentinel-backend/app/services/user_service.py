import uuid
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.core.exceptions import NotFoundException


class UserService:
    def __init__(self, session: AsyncSession):
        self.user_repo = UserRepository(session)

    async def get_by_id(self, user_id: uuid.UUID) -> User:
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise NotFoundException(resource="User", identifier=user_id)
        return user
