"""
Pydantic schemas for authentication.
"""

from typing import Optional

from pydantic import BaseModel, EmailStr


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AdminLoginRequest(BaseModel):
    email: EmailStr
    password: str


class OAuthTokenRequest(BaseModel):
    provider_token: str
    provider: str  # "google" or "facebook"


class UserResponse(BaseModel):
    id: int
    email: str
    name: Optional[str] = None
    avatar_url: Optional[str] = None
    role: str

    class Config:
        from_attributes = True



