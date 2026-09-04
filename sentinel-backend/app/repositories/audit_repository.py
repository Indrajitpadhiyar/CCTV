import uuid
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.audit_log import AuditLog


class AuditRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def log_action(
        self,
        action: str,
        resource_type: str,
        user_id: Optional[uuid.UUID] = None,
        resource_id: Optional[str] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        extra_metadata: Optional[dict] = None
    ) -> AuditLog:
        audit = AuditLog(
            user_id=user_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            ip_address=ip_address,
            user_agent=user_agent,
            extra_metadata=extra_metadata
        )
        self.session.add(audit)
        await self.session.flush()
        return audit
