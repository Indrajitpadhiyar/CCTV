from typing import Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import UserRegister, UserLogin, Token
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token
from app.core.exceptions import ConflictException, UnauthorizedException, NotFoundException


class AuthService:
    def __init__(self, session: AsyncSession):
        self.user_repo = UserRepository(session)

    async def register_user(self, payload: UserRegister) -> User:
        existing_email = await self.user_repo.get_by_email(payload.email)
        if existing_email:
            raise ConflictException(f"User with email '{payload.email}' already exists")
        
        existing_username = await self.user_repo.get_by_username(payload.username)
        if existing_username:
            raise ConflictException(f"User with username '{payload.username}' already exists")

        role = await self.user_repo.get_role_by_name(payload.role_name.upper())
        if not role:
            raise NotFoundException(resource="Role", identifier=payload.role_name)

        hashed_pwd = hash_password(payload.password)
        user = User(
            email=payload.email,
            username=payload.username,
            password_hash=hashed_pwd,
            full_name=payload.full_name,
            role_id=role.id,
            is_active=True
        )
        return await self.user_repo.create_user(user)

    async def authenticate_user(self, payload: UserLogin) -> Tuple[User, Token]:
        # Allow login by email or username
        user = await self.user_repo.get_by_email(payload.username)
        if not user:
            user = await self.user_repo.get_by_username(payload.username)
        
        if not user or not verify_password(payload.password, user.password_hash):
            raise UnauthorizedException("Invalid username/email or password")

        if not user.is_active:
            raise UnauthorizedException("User account is inactive")

        role_name = user.role.name if user.role else "OPERATOR"
        access_token = create_access_token(subject=user.id, role=role_name)
        refresh_token = create_refresh_token(subject=user.id, role=role_name)

        token_response = Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer"
        )
        return user, token_response
