import uuid
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.evidence import Evidence
from app.schemas.evidence import EvidenceCreate
from app.core.exceptions import NotFoundException


class EvidenceService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_evidence(self, payload: EvidenceCreate) -> Evidence:
        evidence = Evidence(**payload.model_dump())
        self.session.add(evidence)
        await self.session.flush()
        await self.session.refresh(evidence)
        return evidence

    async def get_by_id(self, evidence_id: uuid.UUID) -> Evidence:
        stmt = select(Evidence).where(Evidence.id == evidence_id)
        result = await self.session.execute(stmt)
        item = result.scalar_one_or_none()
        if not item:
            raise NotFoundException(resource="Evidence", identifier=evidence_id)
        return item
