import uuid
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from sqlalchemy import String, DateTime, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base


class Alert(Base):
    """System and AI triggered Alert."""
    __tablename__ = "alerts"

    type: Mapped[str] = mapped_column(String(50), nullable=False, index=True) # VEHICLE_WATCHLIST, PERSON_WATCHLIST, ANPR_MATCH, RESTRICTED_AREA, CAMERA_OFFLINE
    severity: Mapped[str] = mapped_column(String(20), default="MEDIUM", nullable=False, index=True) # LOW, MEDIUM, HIGH, CRITICAL
    status: Mapped[str] = mapped_column(String(20), default="NEW", nullable=False, index=True) # NEW, ACKNOWLEDGED, RESOLVED, DISMISSED

    camera_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("cameras.id", ondelete="SET NULL"), nullable=True, index=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False, index=True)

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    extra_metadata: Mapped[Optional[Dict[str, Any]]] = mapped_column("metadata", JSONB, nullable=True)

    acknowledged_by: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    acknowledged_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

__table_args__ = (
    Index("ix_alerts_timestamp_severity", "timestamp", "severity"),
)
