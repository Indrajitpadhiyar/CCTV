from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.auth import UserRegister, UserLogin, Token
from app.schemas.user import UserRead
from app.schemas.response import StandardResponse
from app.services.auth_service import AuthService
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=StandardResponse[UserRead], status_code=status.HTTP_201_CREATED)
async def register(payload: UserRegister, db: AsyncSession = Depends(get_db)):
    auth_service = AuthService(db)
    user = await auth_service.register_user(payload)
    return StandardResponse(data=user, message="User registered successfully")


@router.post("/login", response_model=StandardResponse[Token])
async def login(payload: UserLogin, db: AsyncSession = Depends(get_db)):
    auth_service = AuthService(db)
    user, token = await auth_service.authenticate_user(payload)
    return StandardResponse(data=token, message="Login successful")


@router.post("/refresh", response_model=StandardResponse[Token])
async def refresh_token(current_user: User = Depends(get_current_user)):
    from app.core.security import create_access_token, create_refresh_token
    role_name = current_user.role.name if current_user.role else "OPERATOR"
    access_token = create_access_token(subject=current_user.id, role=role_name)
    refresh_tok = create_refresh_token(subject=current_user.id, role=role_name)
    token = Token(access_token=access_token, refresh_token=refresh_tok)
    return StandardResponse(data=token, message="Token refreshed successfully")


@router.post("/logout", response_model=StandardResponse[dict])
async def logout(current_user: User = Depends(get_current_user)):
    return StandardResponse(data={"logged_out": True}, message="Successfully logged out")


@router.get("/me", response_model=StandardResponse[UserRead])
async def get_me(current_user: User = Depends(get_current_user)):
    return StandardResponse(data=current_user, message="User profile retrieved")
