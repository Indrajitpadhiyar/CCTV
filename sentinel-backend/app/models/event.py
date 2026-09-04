import uuid
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from sqlalchemy import String, DateTime, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base


class Event(Base):
    """Domain and AI Event Record."""
    __tablename__ = "events"

    event_type: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    camera_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("cameras.id", ondelete="SET NULL"), nullable=True, index=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False, index=True)
    severity: Mapped[str] = mapped_column(String(20), default="INFO", nullable=False)

    extra_metadata: Mapped[Optional[Dict[str, Any]]] = mapped_column("metadata", JSONB, nullable=True)
    detection_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("detections.id", ondelete="SET NULL"), nullable=True)
    alert_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("alerts.id", ondelete="SET NULL"), nullable=True)

__table_args__ = (
    Index("ix_events_camera_timestamp", "camera_id", "timestamp"),
)
