import uuid
from typing import Optional, List, Tuple
from sqlalchemy import select, func, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.watchlist import Watchlist


class WatchlistRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, watchlist_id: uuid.UUID) -> Optional[Watchlist]:
        stmt = select(Watchlist).where(Watchlist.id == watchlist_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def find_matching_active(self, value: str, watchlist_type: str = "VEHICLE_PLATE") -> Optional[Watchlist]:
        stmt = select(Watchlist).where(
            Watchlist.value == value.upper(),
            Watchlist.type == watchlist_type,
            Watchlist.is_active == True
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def list_watchlists(
        self,
        skip: int = 0,
        limit: int = 50,
        watchlist_type: Optional[str] = None,
        is_active: Optional[bool] = None
    ) -> Tuple[List[Watchlist], int]:
        stmt = select(Watchlist)
        count_stmt = select(func.count(Watchlist.id))

        if watchlist_type:
            stmt = stmt.where(Watchlist.type == watchlist_type)
            count_stmt = count_stmt.where(Watchlist.type == watchlist_type)
        if is_active is not None:
            stmt = stmt.where(Watchlist.is_active == is_active)
            count_stmt = count_stmt.where(Watchlist.is_active == is_active)

        total = (await self.session.execute(count_stmt)).scalar() or 0
        stmt = stmt.order_by(Watchlist.created_at.desc()).offset(skip).limit(limit)
        items = (await self.session.execute(stmt)).scalars().all()
        return list(items), total

    async def create(self, watchlist: Watchlist) -> Watchlist:
        self.session.add(watchlist)
        await self.session.flush()
        await self.session.refresh(watchlist)
        return watchlist

    async def delete(self, watchlist_id: uuid.UUID) -> bool:
        stmt = delete(Watchlist).where(Watchlist.id == watchlist_id)
        result = await self.session.execute(stmt)
        return result.rowcount > 0
