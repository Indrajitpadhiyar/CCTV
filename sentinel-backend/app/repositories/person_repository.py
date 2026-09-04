import uuid
from datetime import datetime
from typing import Optional, List, Tuple
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.person import Person


class PersonRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, person_id: uuid.UUID) -> Optional[Person]:
        stmt = select(Person).where(Person.id == person_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def list_persons(
        self,
        skip: int = 0,
        limit: int = 50,
        camera_id: Optional[uuid.UUID] = None,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None
    ) -> Tuple[List[Person], int]:
        stmt = select(Person)
        count_stmt = select(func.count(Person.id))

        if camera_id:
            stmt = stmt.where(Person.camera_id == camera_id)
            count_stmt = count_stmt.where(Person.camera_id == camera_id)
        if start_time:
            stmt = stmt.where(Person.timestamp >= start_time)
            count_stmt = count_stmt.where(Person.timestamp >= start_time)
        if end_time:
            stmt = stmt.where(Person.timestamp <= end_time)
            count_stmt = count_stmt.where(Person.timestamp <= end_time)

        total = (await self.session.execute(count_stmt)).scalar() or 0
        stmt = stmt.order_by(Person.timestamp.desc()).offset(skip).limit(limit)
        persons = (await self.session.execute(stmt)).scalars().all()
        return list(persons), total

    async def create(self, person: Person) -> Person:
        self.session.add(person)
        await self.session.flush()
        await self.session.refresh(person)
        return person
