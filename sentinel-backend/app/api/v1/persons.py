from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.person import PersonSearchRequest, PersonSearchMatch, PersonRead
from app.schemas.response import StandardResponse
from app.services.person_service import PersonService
from app.api.deps import require_role
from app.models.user import User

router = APIRouter(prefix="/persons", tags=["Persons"])


@router.post("/search", response_model=StandardResponse[List[PersonSearchMatch]])
async def search_person_reid(
    payload: PersonSearchRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR", "INVESTIGATOR", "VIEWER"))
):
    service = PersonService(db)
    matches = await service.search_similar_persons(payload)
    return StandardResponse(data=matches, message="Person Re-ID search results retrieved")
