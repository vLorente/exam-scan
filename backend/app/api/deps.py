from typing import Generator, Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session, select

from app.core.database import get_session
from app.core.security import verify_token
from app.core.exceptions import authentication_error
from app.models.user import User

# Security scheme
security = HTTPBearer()

# Database dependency
DatabaseSession = Annotated[Session, Depends(get_session)]

def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    """Get current user ID from JWT token"""
    token_data = verify_token(credentials.credentials)
    if token_data is None:
        raise authentication_error("Could not validate credentials")
    return token_data

# Current user ID dependency
CurrentUserId = Annotated[str, Depends(get_current_user_id)]

def get_current_user(
    session: Session = Depends(get_session),
    user_id: str = Depends(get_current_user_id)
) -> User:
    """Get current user from database"""
    user = session.exec(select(User).where(User.id == int(user_id))).first()
    if not user:
        raise authentication_error("User not found")
    if not user.is_active:
        raise authentication_error("Inactive user")
    return user

# Current user dependency
CurrentUser = Annotated[User, Depends(get_current_user)]
