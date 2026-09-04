import uuid
from typing import Optional, List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.watchlist import Watchlist
from app.repositories.watchlist_repository import WatchlistRepository
from app.schemas.watchlist import WatchlistCreate, WatchlistUpdate
from app.core.exceptions import NotFoundException


class WatchlistService:
    def __init__(self, session: AsyncSession):
        self.watchlist_repo = WatchlistRepository(session)

    async def create_watchlist(self, payload: WatchlistCreate) -> Watchlist:
        data = payload.model_dump()
        data["value"] = data["value"].upper()
        watchlist = Watchlist(**data)
        return await self.watchlist_repo.create(watchlist)

    async def get_by_id(self, watchlist_id: uuid.UUID) -> Watchlist:
        item = await self.watchlist_repo.get_by_id(watchlist_id)
        if not item:
            raise NotFoundException(resource="Watchlist item", identifier=watchlist_id)
        return item

    async def list_watchlists(
        self,
        page: int = 1,
        page_size: int = 50,
        watchlist_type: Optional[str] = None,
        is_active: Optional[bool] = None
    ) -> Tuple[List[Watchlist], int]:
        skip = (page - 1) * page_size
        return await self.watchlist_repo.list_watchlists(
            skip=skip,
            limit=page_size,
            watchlist_type=watchlist_type,
            is_active=is_active
        )

    async def update_watchlist(self, watchlist_id: uuid.UUID, payload: WatchlistUpdate) -> Watchlist:
        item = await self.get_by_id(watchlist_id)
        update_data = payload.model_dump(exclude_unset=True)
        if "value" in update_data and update_data["value"]:
            update_data["value"] = update_data["value"].upper()
        for key, value in update_data.items():
            setattr(item, key, value)
        await self.watchlist_repo.session.flush()
        await self.watchlist_repo.session.refresh(item)
        return item

    async def delete_watchlist(self, watchlist_id: uuid.UUID) -> bool:
        await self.get_by_id(watchlist_id)
        return await self.watchlist_repo.delete(watchlist_id)
