from typing import Generator, Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session

from app.core.database import get_session
from app.core.security import verify_token
from app.core.exceptions import authentication_error

# Security scheme
security = HTTPBearer()

# Database dependency
DatabaseSession = Annotated[Session, Depends(get_session)]

def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    """Get current user from JWT token"""
    token_data = verify_token(credentials.credentials)
    if token_data is None:
        raise authentication_error("Could not validate credentials")
    return token_data

# Current user dependency
CurrentUserId = Annotated[str, Depends(get_current_user_id)]
