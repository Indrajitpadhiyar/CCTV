import uuid
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.evidence import EvidenceCreate, EvidenceRead
from app.schemas.response import StandardResponse
from app.services.evidence_service import EvidenceService
from app.api.deps import require_role
from app.models.user import User

router = APIRouter(prefix="/evidence", tags=["Evidence"])


@router.post("", response_model=StandardResponse[EvidenceRead], status_code=status.HTTP_201_CREATED)
async def create_evidence(
    payload: EvidenceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR", "INVESTIGATOR"))
):
    service = EvidenceService(db)
    evidence = await service.create_evidence(payload)
    return StandardResponse(data=evidence, message="Evidence record created")


@router.get("/{evidence_id}", response_model=StandardResponse[EvidenceRead])
async def get_evidence(
    evidence_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN", "OPERATOR", "INVESTIGATOR", "VIEWER"))
):
    service = EvidenceService(db)
    evidence = await service.get_by_id(evidence_id)
    return StandardResponse(data=evidence, message="Evidence record retrieved")
