import uuid
from typing import Optional
from sqlalchemy import String, Boolean, Integer
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base


class Watchlist(Base):
    """Watchlist model for targeted vehicle plates or person references."""
    __tablename__ = "watchlists"

    type: Mapped[str] = mapped_column(String(50), nullable=False, index=True) # VEHICLE_PLATE, PERSON_REID, FACE
    value: Mapped[str] = mapped_column(String(100), nullable=False, index=True) # e.g. "GJ01AB1234"
    description: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    priority: Mapped[str] = mapped_column(String(20), default="HIGH", nullable=False) # LOW, MEDIUM, HIGH, CRITICAL
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, index=True)
