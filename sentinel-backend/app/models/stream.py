import uuid
from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base

if TYPE_CHECKING:
    from app.models.camera import Camera


class Stream(Base):
    """RTSP/HLS Stream configuration and health tracking."""
    __tablename__ = "streams"

    camera_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("cameras.id", ondelete="CASCADE"), nullable=False)
    stream_url: Mapped[str] = mapped_column(String(500), nullable=False)
    stream_type: Mapped[str] = mapped_column(String(50), default="main", nullable=False) # main, sub, hls, webrtc
    status: Mapped[str] = mapped_column(String(20), default="disconnected", nullable=False) # connected, disconnected, error
    last_connected_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    last_error: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    reconnect_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    camera: Mapped["Camera"] = relationship("Camera", back_populates="streams")
