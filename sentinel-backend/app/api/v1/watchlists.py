import uuid
from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.watchlist import WatchlistCreate, WatchlistUpdate, WatchlistRead
from app.schemas.response import StandardResponse, PaginatedResponse
from app.services.watchlist_service import WatchlistService
from app.utils.pagination import paginate
from app.api.deps import require_role
from app.models.user import User

router = APIRouter(prefix="/watchlists", tags=["Watchlists"])


@router.post("", response_model=StandardResponse[WatchlistRead], status_code=status.HTTP_201_CREATED)
async def create_watchlist_item(
    payload: WatchlistCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR"))
):
    service = WatchlistService(db)
    item = await service.create_watchlist(payload)
    return StandardResponse(data=item, message="Watchlist item created successfully")


@router.get("", response_model=StandardResponse[PaginatedResponse[WatchlistRead]])
async def list_watchlists(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    type: Optional[str] = Query(None, alias="type"),
    is_active: Optional[bool] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR", "INVESTIGATOR", "VIEWER"))
):
    service = WatchlistService(db)
    items, total = await service.list_watchlists(
        page=page,
        page_size=page_size,
        watchlist_type=type,
        is_active=is_active
    )
    paginated = paginate(items, total, page, page_size)
    return StandardResponse(data=paginated, message="Watchlist items retrieved")


@router.get("/{id}", response_model=StandardResponse[WatchlistRead])
async def get_watchlist_item(
    id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR", "INVESTIGATOR", "VIEWER"))
):
    service = WatchlistService(db)
    item = await service.get_by_id(id)
    return StandardResponse(data=item, message="Watchlist item retrieved")


@router.patch("/{id}", response_model=StandardResponse[WatchlistRead])
async def update_watchlist_item(
    id: uuid.UUID,
    payload: WatchlistUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR"))
):
    service = WatchlistService(db)
    updated = await service.update_watchlist(id, payload)
    return StandardResponse(data=updated, message="Watchlist item updated")


@router.delete("/{id}", response_model=StandardResponse[dict])
async def delete_watchlist_item(
    id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN"))
):
    service = WatchlistService(db)
    deleted = await service.delete_watchlist(id)
    return StandardResponse(data={"deleted": deleted}, message="Watchlist item deleted")
