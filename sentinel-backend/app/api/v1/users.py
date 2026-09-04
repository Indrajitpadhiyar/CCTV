import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.user import UserRead
from app.schemas.response import StandardResponse
from app.services.user_service import UserService
from app.api.deps import require_role
from app.models.user import User

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/{user_id}", response_model=StandardResponse[UserRead])
async def get_user_by_id(
    user_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR"))
):
    service = UserService(db)
    user = await service.get_by_id(user_id)
    return StandardResponse(data=user, message="User retrieved")
