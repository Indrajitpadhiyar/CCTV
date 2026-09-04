from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None
    exp: Optional[int] = None


class UserRegister(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: Optional[str] = None
    role_name: str = "OPERATOR"


class UserLogin(BaseModel):
    username: str # email or username
    password: str
