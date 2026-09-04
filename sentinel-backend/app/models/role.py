import uuid
from typing import List, TYPE_CHECKING
from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base

if TYPE_CHECKING:
    from app.models.user import User


class Role(Base):
    """Role model for RBAC."""
    __tablename__ = "roles"

    name: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=True)

    users: Mapped[List["User"]] = relationship("User", back_populates="role")
