from typing import Optional, List, TYPE_CHECKING
from sqlmodel import Field, SQLModel, Relationship
from enum import Enum
from datetime import datetime
from .base import BaseModel

if TYPE_CHECKING:
    from .exam import Exam, ExamRead
    from .question import Question, QuestionRead, Option, OptionRead
    from .user import User

class SessionStatus(str, Enum):
    """Estados de una sesión de examen"""
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    ABANDONED = "abandoned"
    EXPIRED = "expired"

class ExamSessionBase(SQLModel):
    """Modelo base para ExamSession - campos compartidos"""
    start_time: datetime = Field(default_factory=datetime.utcnow)
    end_time: Optional[datetime] = None
    status: SessionStatus = Field(default=SessionStatus.IN_PROGRESS)
    score: Optional[float] = Field(default=None, ge=0.0, le=100.0)
    total_points: Optional[float] = Field(default=None, ge=0.0)
    earned_points: Optional[float] = Field(default=None, ge=0.0)
    attempt_number: int = Field(default=1, ge=1)
    time_spent_minutes: Optional[int] = Field(default=None, ge=0)

class ExamSession(ExamSessionBase, BaseModel, table=True):
    """Modelo de tabla para ExamSession"""
    id: Optional[int] = Field(default=None, primary_key=True)
    exam_id: int = Field(foreign_key="exam.id")
    student_id: int = Field(foreign_key="user.id")
    
    # Relationships
    exam: "Exam" = Relationship(back_populates="sessions")
    student: "User" = Relationship(back_populates="exam_sessions")
    student_answers: List["StudentAnswer"] = Relationship(back_populates="session", cascade_delete=True)

class ExamSessionCreate(SQLModel):
    """Modelo para crear sesión de examen"""
    exam_id: int

class ExamSessionRead(ExamSessionBase):
    """Modelo para leer sesión de examen"""
    id: int
    exam_id: int
    student_id: int
    created_at: str
    updated_at: Optional[str] = None

class ExamSessionReadWithExam(ExamSessionRead):
    """Modelo para leer sesión con información del examen"""
    exam: "ExamRead"

class ExamSessionReadWithAnswers(ExamSessionRead):
    """Modelo para leer sesión con respuestas"""
    student_answers: List["StudentAnswerRead"] = []

class ExamSessionUpdate(SQLModel):
    """Modelo para actualizar sesión de examen"""
    end_time: Optional[datetime] = None
    status: Optional[SessionStatus] = None
    score: Optional[float] = Field(default=None, ge=0.0, le=100.0)
    total_points: Optional[float] = Field(default=None, ge=0.0)
    earned_points: Optional[float] = Field(default=None, ge=0.0)
    time_spent_minutes: Optional[int] = Field(default=None, ge=0)

# =====================================================
# StudentAnswer Models
# =====================================================

class StudentAnswerBase(SQLModel):
    """Modelo base para StudentAnswer - campos compartidos"""
    answered_at: datetime = Field(default_factory=datetime.utcnow)
    is_correct: Optional[bool] = None  # Se calcula automáticamente
    points_earned: Optional[float] = Field(default=None, ge=0.0)

class StudentAnswer(StudentAnswerBase, BaseModel, table=True):
    """Modelo de tabla para StudentAnswer"""
    id: Optional[int] = Field(default=None, primary_key=True)
    session_id: int = Field(foreign_key="examsession.id")
    question_id: int = Field(foreign_key="question.id")
    selected_option_id: Optional[int] = Field(default=None, foreign_key="option.id")
    
    # Relationships
    session: ExamSession = Relationship(back_populates="student_answers")
    question: "Question" = Relationship(back_populates="student_answers")
    selected_option: Optional["Option"] = Relationship(back_populates="student_answers")

class StudentAnswerCreate(SQLModel):
    """Modelo para crear respuesta de estudiante"""
    question_id: int
    selected_option_id: Optional[int] = None

class StudentAnswerRead(StudentAnswerBase):
    """Modelo para leer respuesta de estudiante"""
    id: int
    session_id: int
    question_id: int
    selected_option_id: Optional[int] = None
    created_at: str
    updated_at: Optional[str] = None

class StudentAnswerReadWithDetails(StudentAnswerRead):
    """Modelo para leer respuesta con detalles"""
    question: "QuestionRead"
    selected_option: Optional["OptionRead"] = None

class StudentAnswerUpdate(SQLModel):
    """Modelo para actualizar respuesta de estudiante"""
    selected_option_id: Optional[int] = None
    is_correct: Optional[bool] = None
    points_earned: Optional[float] = Field(default=None, ge=0.0)
