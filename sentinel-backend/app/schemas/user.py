import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict


class RoleRead(BaseModel):
    id: uuid.UUID
    name: str
    description: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)


class UserRead(BaseModel):
    id: uuid.UUID
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    is_active: bool
    role: RoleRead
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None
