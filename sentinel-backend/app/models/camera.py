import uuid
from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Float, Integer, DateTime, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base

if TYPE_CHECKING:
    from app.models.stream import Stream
    from app.models.detection import Detection


class Camera(Base):
    """CCTV Camera model."""
    __tablename__ = "cameras"

    camera_code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    vendor: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    model: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    protocol: Mapped[str] = mapped_column(String(20), default="RTSP", nullable=False)
    rtsp_url: Mapped[str] = mapped_column(String(500), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="offline", index=True, nullable=False) # online, offline, degraded

    # GIS / Location details
    latitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    location_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    zone: Mapped[Optional[str]] = mapped_column(String(100), index=True, nullable=True)
    district: Mapped[Optional[str]] = mapped_column(String(100), index=True, nullable=True)
    state: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    fps: Mapped[int] = mapped_column(Integer, default=25, nullable=False)
    resolution: Mapped[Optional[str]] = mapped_column(String(50), default="1920x1080", nullable=True)
    last_seen_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    streams: Mapped[List["Stream"]] = relationship("Stream", back_populates="camera", cascade="all, delete-orphan")
    detections: Mapped[List["Detection"]] = relationship("Detection", back_populates="camera", cascade="all, delete-orphan")

__table_args__ = (
    Index("ix_cameras_status_district_zone", "status", "district", "zone"),
)
