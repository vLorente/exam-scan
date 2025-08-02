from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship
from enum import Enum
from .base import BaseModel

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

class UserRead(UserBase):
    """Modelo para leer usuario (sin password)"""
    id: int
    created_at: str
    updated_at: Optional[str] = None

class UserUpdate(SQLModel):
    """Modelo para actualizar usuario"""
    email: Optional[str] = Field(default=None, max_length=255)
    username: Optional[str] = Field(default=None, max_length=50) 
    full_name: Optional[str] = Field(default=None, max_length=100)
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None
    password: Optional[str] = Field(default=None, min_length=8, max_length=100)
