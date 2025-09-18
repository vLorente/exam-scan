from sqlmodel import SQLModel
from .user import UserRead

class LoginResponse(SQLModel):
    """Modelo de respuesta para login"""
    access_token: str
    token_type: str
    current_user: UserRead

# Futuros modelos de auth como RefreshToken, PasswordReset, etc. irían aquí...
