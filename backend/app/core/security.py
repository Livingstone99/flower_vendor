"""
Security utilities for JWT tokens and password hashing.
"""

from datetime import datetime, timedelta
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

import requests
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_google_token(token: str) -> Optional[dict]:
    """Verify Google OAuth token."""
    try:
        id_info = id_token.verify_oauth2_token(
            token, google_requests.Request(), settings.google_client_id
        )
        return id_info
    except ValueError:
        return None


def verify_facebook_token(token: str) -> Optional[dict]:
    """Verify Facebook OAuth token."""
    try:
        # 1. Generate app access token (if not using a permanent one) or just use the user token to get info
        # Properly, we should verify the token with the debug_token endpoint
        debug_url = "https://graph.facebook.com/debug_token"
        params = {
            "input_token": token,
            "access_token": f"{settings.facebook_app_id}|{settings.facebook_app_secret}",
        }
        response = requests.get(debug_url, params=params)
        data = response.json()

        if "data" in data and data["data"].get("is_valid"):
            # Token is valid, now get user info
            user_id = data["data"]["user_id"]
            user_url = f"https://graph.facebook.com/{user_id}"
            user_params = {
                "fields": "id,name,email,picture",
                "access_token": token,
            }
            user_response = requests.get(user_url, params=user_params)
            user_data = user_response.json()
            return user_data
        return None
    except Exception:
        return None


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password."""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expires_minutes)
    to_encode.update({"exp": expire, "iat": datetime.utcnow(), "iss": settings.jwt_issuer, "aud": settings.jwt_audience})
    encoded_jwt = jwt.encode(to_encode, settings.jwt_secret, algorithm="HS256")
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """Decode and verify a JWT access token."""
    try:
        payload = jwt.decode(
            token, settings.jwt_secret, algorithms=["HS256"], issuer=settings.jwt_issuer, audience=settings.jwt_audience
        )
        return payload
    except JWTError:
        return None



