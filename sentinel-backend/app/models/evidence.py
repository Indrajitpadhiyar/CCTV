import uuid
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base, JSONField


class Evidence(Base):
    """Media evidence references (snapshots, video clips)."""
    __tablename__ = "evidence"

    event_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("events.id", ondelete="CASCADE"), nullable=True)
    type: Mapped[str] = mapped_column(String(50), nullable=False) # snapshot, video_clip, crop
    storage_path: Mapped[str] = mapped_column(String(500), nullable=False)
    thumbnail_path: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    checksum: Mapped[Optional[str]] = mapped_column(String(64), nullable=True) # SHA-256 hash for integrity
    extra_metadata: Mapped[Optional[Dict[str, Any]]] = mapped_column("metadata", JSONField, nullable=True)
