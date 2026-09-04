import uuid
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List
from sqlalchemy import String, Float, DateTime, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base, JSONField


class Track(Base):
    """Multi-camera trajectory track record."""
    __tablename__ = "tracks"

    entity_type: Mapped[str] = mapped_column(String(50), nullable=False) # vehicle, person
    entity_reference: Mapped[str] = mapped_column(String(100), nullable=False, index=True) # plate_number or person_reid_hash
    camera_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("cameras.id", ondelete="CASCADE"), nullable=False, index=True)
    
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    ended_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    
    trajectory: Mapped[Optional[List[Dict[str, Any]]]] = mapped_column(JSONField, nullable=True) # [{camera_id, lat, lng, timestamp}]
    confidence: Mapped[float] = mapped_column(Float, default=1.0, nullable=False)

__table_args__ = (
    Index("ix_tracks_entity_ref", "entity_type", "entity_reference"),
)
