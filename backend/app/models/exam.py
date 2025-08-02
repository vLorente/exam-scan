from typing import Optional, List, TYPE_CHECKING
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime
from enum import Enum
from .base import BaseModel, TimestampMixin

if TYPE_CHECKING:
    from .user import User, UserRead
    from .question import Question, QuestionRead
    from .session import ExamSession

class ExamStatus(str, Enum):
    """Estados de un examen"""
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"

class ExamType(str, Enum):
    """Tipos de examen"""
    MULTIPLE_CHOICE = "multiple_choice"
    TRUE_FALSE = "true_false"
    MIXED = "mixed"

class ExamBase(SQLModel):
    """Modelo base para Exam - campos compartidos"""
    title: str = Field(max_length=200, index=True)
    description: Optional[str] = Field(default=None, max_length=1000)
    subject: str = Field(max_length=100, index=True)
    duration_minutes: Optional[int] = Field(default=None, ge=1, le=480)  # máximo 8 horas
    max_attempts: int = Field(default=1, ge=1, le=10)
    passing_score: float = Field(default=60.0, ge=0.0, le=100.0)
    status: ExamStatus = Field(default=ExamStatus.DRAFT)
    exam_type: ExamType = Field(default=ExamType.MULTIPLE_CHOICE)
    instructions: Optional[str] = Field(default=None, max_length=2000)
    is_public: bool = Field(default=False)  # Si otros profesores pueden ver/copiar
    randomize_questions: bool = Field(default=False)
    randomize_options: bool = Field(default=False)

class Exam(ExamBase, BaseModel, table=True):
    """Modelo de tabla para Exam"""
    id: Optional[int] = Field(default=None, primary_key=True)
    creator_id: int = Field(foreign_key="user.id")
    
    # Relationships
    creator: "User" = Relationship(back_populates="created_exams")
    questions: List["Question"] = Relationship(back_populates="exam")
    sessions: List["ExamSession"] = Relationship(back_populates="exam")

class ExamCreate(ExamBase):
    """Modelo para crear examen"""
    pass

class ExamRead(ExamBase, TimestampMixin):
    """Modelo para leer examen"""
    id: int
    creator_id: int

class ExamReadWithCreator(ExamRead):
    """Modelo para leer examen con información del creador"""
    creator: "UserRead"

class ExamReadWithQuestions(ExamRead):
    """Modelo para leer examen con preguntas"""
    questions: List["QuestionRead"] = []

class ExamUpdate(SQLModel):
    """Modelo para actualizar examen"""
    title: Optional[str] = Field(default=None, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    subject: Optional[str] = Field(default=None, max_length=100)
    duration_minutes: Optional[int] = Field(default=None, ge=1, le=480)
    max_attempts: Optional[int] = Field(default=None, ge=1, le=10)
    passing_score: Optional[float] = Field(default=None, ge=0.0, le=100.0)
    status: Optional[ExamStatus] = None
    exam_type: Optional[ExamType] = None
    instructions: Optional[str] = Field(default=None, max_length=2000)
    is_public: Optional[bool] = None
    randomize_questions: Optional[bool] = None
    randomize_options: Optional[bool] = None
