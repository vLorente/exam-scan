from datetime import datetime, timedelta, timezone
from typing import Any, Union, Optional
import jwt
from jwt import ExpiredSignatureError, InvalidTokenError
from passlib.context import CryptContext
from fastapi import HTTPException, status
from .config import settings

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(
    user_id: int, username: str, role: str, expires_delta: Optional[timedelta] = None
) -> str:
    """Create JWT access token with user info"""
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    
    to_encode = {
        "exp": expire,
        "sub": str(user_id),
        "username": username,
        "role": role
    }
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Get password hash"""
    return pwd_context.hash(password)

def verify_token(token: str) -> Union[str, None]:
    """Verify JWT token and return subject (user_id)"""
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
            options={"require": ["exp", "sub"]},
        )
        return payload.get("sub")
    except (ExpiredSignatureError, InvalidTokenError):
        return None

def get_token_data(token: str) -> Union[dict, None]:
    """Verify JWT token and return complete token data"""
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
            options={"require": ["exp", "sub"]},
        )
        return {
            "user_id": int(payload.get("sub")),
            "username": payload.get("username"),
            "role": payload.get("role")
        }
    except (ExpiredSignatureError, InvalidTokenError):
        return None
