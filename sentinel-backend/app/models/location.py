import uuid
from typing import Optional
from sqlalchemy import String, Float
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base


class Location(Base):
    """GIS Location and Zone model."""
    __tablename__ = "locations"

    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    district: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    state: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    zone: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
