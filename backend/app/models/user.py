from typing import Optional, List, TYPE_CHECKING
from sqlmodel import Field, SQLModel, Relationship
from enum import Enum
from datetime import datetime
from .base import BaseModel

if TYPE_CHECKING:
    from .exam import Exam
    from .session import ExamSession

class UserRole(str, Enum):
    """Roles de usuario en el sistema"""
    ADMIN = "admin"
    TEACHER = "teacher"
    STUDENT = "student"

class UserBase(SQLModel):
    """Modelo base para User - campos compartidos"""
    email: str = Field(unique=True, index=True, max_length=255)
    username: str = Field(unique=True, index=True, max_length=50)
    full_name: str = Field(max_length=100)
    role: UserRole = Field(default=UserRole.STUDENT)
    is_active: bool = Field(default=True)

class User(UserBase, BaseModel, table=True):
    """Modelo de tabla para User"""
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str = Field(max_length=255)
    
    # Relationships
    created_exams: List["Exam"] = Relationship(back_populates="creator")
    exam_sessions: List["ExamSession"] = Relationship(back_populates="student")

class UserCreate(UserBase):
    """Modelo para crear usuario"""
    password: str = Field(min_length=8, max_length=100)

class UserLogin(SQLModel):
    """Modelo para login de usuario"""
    email: str
    password: str

class UserRead(UserBase):
    """Modelo para leer usuario (sin password)"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

class UserReadFull(UserBase):
    """Modelo completo para leer usuario con timestamps"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

class UserUpdate(SQLModel):
    """Modelo para actualizar usuario"""
    email: Optional[str] = Field(default=None, max_length=255)
    username: Optional[str] = Field(default=None, max_length=50) 
    full_name: Optional[str] = Field(default=None, max_length=100)
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None
    password: Optional[str] = Field(default=None, min_length=8, max_length=100)
