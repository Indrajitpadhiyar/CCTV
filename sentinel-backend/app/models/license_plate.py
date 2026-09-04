import uuid
from datetime import datetime, timezone
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Float, DateTime, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base

if TYPE_CHECKING:
    from app.models.vehicle import Vehicle


class LicensePlate(Base):
    """License Plate / ANPR Recognition Record."""
    __tablename__ = "license_plates"

    vehicle_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("vehicles.id", ondelete="SET NULL"), nullable=True)
    camera_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("cameras.id", ondelete="CASCADE"), nullable=False, index=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False, index=True)

    plate_number: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    confidence: Mapped[float] = mapped_column(Float, nullable=False)
    country: Mapped[Optional[str]] = mapped_column(String(50), default="IND", nullable=True)
    state: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    raw_text: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    vehicle: Mapped[Optional["Vehicle"]] = relationship("Vehicle", back_populates="license_plates")

__table_args__ = (
    Index("ix_license_plates_plate_timestamp", "plate_number", "timestamp"),
    Index("ix_license_plates_camera_plate", "camera_id", "plate_number"),
)
