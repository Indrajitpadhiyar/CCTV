import uuid
from datetime import datetime, timezone
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Float, DateTime, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base

if TYPE_CHECKING:
    from app.models.license_plate import LicensePlate


class Vehicle(Base):
    """Vehicle Detection Analytics Record."""
    __tablename__ = "vehicles"

    detection_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("detections.id", ondelete="CASCADE"), nullable=False, index=True)
    camera_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("cameras.id", ondelete="CASCADE"), nullable=False, index=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False, index=True)
    
    vehicle_type: Mapped[str] = mapped_column(String(50), nullable=False) # sedan, suv, truck, motorcycle, bus
    color: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    make: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    model: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    confidence: Mapped[float] = mapped_column(Float, nullable=False)
    track_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    embedding_reference: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    license_plates: Mapped[List["LicensePlate"]] = relationship("LicensePlate", back_populates="vehicle", cascade="all, delete-orphan")

__table_args__ = (
    Index("ix_vehicles_camera_timestamp", "camera_id", "timestamp"),
)
