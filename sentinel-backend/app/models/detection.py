import uuid
from datetime import datetime, timezone
from typing import Optional, Dict, Any, TYPE_CHECKING
from sqlalchemy import String, Float, DateTime, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, JSONField

if TYPE_CHECKING:
    from app.models.camera import Camera


class Detection(Base):
    """General AI Object Detection Record."""
    __tablename__ = "detections"

    camera_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("cameras.id", ondelete="CASCADE"), nullable=False, index=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False, index=True)
    frame_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    object_type: Mapped[str] = mapped_column(String(50), nullable=False, index=True) # vehicle, person, bicycle, etc.
    confidence: Mapped[float] = mapped_column(Float, nullable=False)
    bounding_box: Mapped[Dict[str, Any]] = mapped_column(JSONField, nullable=False) # {x1, y1, x2, y2}
    track_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    model_name: Mapped[str] = mapped_column(String(100), default="yolov8x", nullable=False)
    extra_metadata: Mapped[Optional[Dict[str, Any]]] = mapped_column("metadata", JSONField, nullable=True)

    camera: Mapped["Camera"] = relationship("Camera", back_populates="detections")

__table_args__ = (
    Index("ix_detections_camera_timestamp", "camera_id", "timestamp"),
    Index("ix_detections_object_timestamp", "object_type", "timestamp"),
)
