import uuid
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.audit_repository import AuditRepository


class AuditService:
    def __init__(self, session: AsyncSession):
        self.audit_repo = AuditRepository(session)

    async def log_action(
        self,
        action: str,
        resource_type: str,
        user_id: Optional[uuid.UUID] = None,
        resource_id: Optional[str] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        extra_metadata: Optional[dict] = None
    ):
        return await self.audit_repo.log_action(
            user_id=user_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            ip_address=ip_address,
            user_agent=user_agent,
            extra_metadata=extra_metadata
        )
