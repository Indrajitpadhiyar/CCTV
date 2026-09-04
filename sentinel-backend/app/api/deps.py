import uuid
from typing import Callable, AsyncGenerator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import decode_token
from app.core.exceptions import UnauthorizedException, ForbiddenException
from app.models.user import User
from app.repositories.user_repository import UserRepository

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    """Dependency for resolving authenticated user from JWT bearer token."""
    try:
        payload = decode_token(token)
        user_id_str = payload.get("sub")
        if not user_id_str:
            raise UnauthorizedException("Token payload missing subject identifier")
        user_id = uuid.UUID(user_id_str)
    except Exception:
        raise UnauthorizedException("Could not validate credentials")

    user_repo = UserRepository(db)
    user = await user_repo.get_by_id(user_id)
    if not user:
        raise UnauthorizedException("User not found")
    if not user.is_active:
        raise UnauthorizedException("Inactive user account")
    return user


async def get_current_user_optional(
    token: Optional[str] = Depends(OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)),
    db: AsyncSession = Depends(get_db)
) -> Optional[User]:
    """Dependency for resolving optional authenticated user."""
    if not token:
        return None
    try:
        payload = decode_token(token)
        user_id_str = payload.get("sub")
        if user_id_str:
            user_repo = UserRepository(db)
            return await user_repo.get_by_id(uuid.UUID(user_id_str))
    except Exception:
        return None
    return None


def require_role(*allowed_roles: str, allow_guest: bool = False) -> Callable:
    """RBAC dependency factory for role checking."""
    async def role_checker(
        current_user: Optional[User] = Depends(get_current_user_optional)
    ) -> Optional[User]:
        if allow_guest and not current_user:
            return None
        if not current_user:
            raise UnauthorizedException("Authentication token required")
        user_role = current_user.role.name if current_user.role else "VIEWER"
        if user_role not in allowed_roles and "ADMIN" not in allowed_roles:
            raise ForbiddenException(f"Role '{user_role}' is not authorized to access this endpoint")
        return current_user
    return role_checker
