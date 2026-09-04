import uuid
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.search import UnifiedSearchResponse
from app.schemas.response import StandardResponse
from app.services.search_service import SearchService
from app.api.deps import require_role
from app.models.user import User

router = APIRouter(prefix="/search", tags=["Global Search"])


@router.get("", response_model=StandardResponse[UnifiedSearchResponse])
async def global_search(
    query: str = Query(..., description="Unified search query string"),
    camera_id: Optional[uuid.UUID] = None,
    district: Optional[str] = None,
    start_time: Optional[datetime] = None,
    end_time: Optional[datetime] = None,
    type: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR", "INVESTIGATOR", "VIEWER"))
):
    service = SearchService(db)
    results = await service.search(
        query=query,
        camera_id=camera_id,
        district=district,
        start_time=start_time,
        end_time=end_time
    )
    return StandardResponse(data=results, message="Unified search completed")
