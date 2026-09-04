import uuid
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from sqlalchemy import String, Float, DateTime, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base, JSONField


class Person(Base):
    """Person Detection & Re-Identification Record."""
    __tablename__ = "persons"

    camera_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("cameras.id", ondelete="CASCADE"), nullable=False, index=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False, index=True)
    track_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    confidence: Mapped[float] = mapped_column(Float, nullable=False)
    embedding_reference: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    attributes: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONField, nullable=True) # gender, upper_color, lower_color, hat, glasses

__table_args__ = (
    Index("ix_persons_camera_timestamp", "camera_id", "timestamp"),
)
