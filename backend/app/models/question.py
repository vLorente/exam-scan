from typing import Optional, List, TYPE_CHECKING
from sqlmodel import Field, SQLModel, Relationship
from enum import Enum
from .base import BaseModel

if TYPE_CHECKING:
    from .exam import Exam
    from .session import StudentAnswer


class QuestionType(str, Enum):
    """Tipos de pregunta"""
    MULTIPLE_CHOICE = "multiple_choice"
    TRUE_FALSE = "true_false"
    SINGLE_CHOICE = "single_choice"

class QuestionDifficulty(str, Enum):
    """Niveles de dificultad"""
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

class QuestionBase(SQLModel):
    """Modelo base para Question - campos compartidos"""
    text: str = Field(max_length=2000)
    question_type: QuestionType = Field(default=QuestionType.MULTIPLE_CHOICE)
    points: float = Field(default=1.0, ge=0.1, le=10.0)
    difficulty: QuestionDifficulty = Field(default=QuestionDifficulty.MEDIUM)
    explanation: Optional[str] = Field(default=None, max_length=1000)
    order_index: int = Field(default=0, ge=0)  # Orden en el examen
    is_active: bool = Field(default=True)

class Question(QuestionBase, BaseModel, table=True):
    """Modelo de tabla para Question"""
    id: Optional[int] = Field(default=None, primary_key=True)
    exam_id: int = Field(foreign_key="exam.id")
    
    # Relationships
    exam: "Exam" = Relationship(back_populates="questions")
    options: List["Option"] = Relationship(back_populates="question", cascade_delete=True)
    student_answers: List["StudentAnswer"] = Relationship(back_populates="question")

class QuestionCreate(QuestionBase):
    """Modelo para crear pregunta"""
    pass

class QuestionRead(QuestionBase):
    """Modelo para leer pregunta"""
    id: int
    exam_id: int
    created_at: str
    updated_at: Optional[str] = None

class QuestionReadWithOptions(QuestionRead):
    """Modelo para leer pregunta con opciones"""
    options: List["OptionRead"] = []

class QuestionUpdate(SQLModel):
    """Modelo para actualizar pregunta"""
    text: Optional[str] = Field(default=None, max_length=2000)
    question_type: Optional[QuestionType] = None
    points: Optional[float] = Field(default=None, ge=0.1, le=10.0)
    difficulty: Optional[QuestionDifficulty] = None
    explanation: Optional[str] = Field(default=None, max_length=1000)
    order_index: Optional[int] = Field(default=None, ge=0)
    is_active: Optional[bool] = None

# =====================================================
# Option Models
# =====================================================

class OptionBase(SQLModel):
    """Modelo base para Option - campos compartidos"""
    text: str = Field(max_length=500)
    is_correct: bool = Field(default=False)
    order_index: int = Field(default=0, ge=0)  # Orden de la opción

class Option(OptionBase, BaseModel, table=True):
    """Modelo de tabla para Option"""
    id: Optional[int] = Field(default=None, primary_key=True)
    question_id: int = Field(foreign_key="question.id")
    
    # Relationships
    question: Question = Relationship(back_populates="options")
    student_answers: List["StudentAnswer"] = Relationship(back_populates="selected_option")

class OptionCreate(OptionBase):
    """Modelo para crear opción"""
    pass

class OptionRead(OptionBase):
    """Modelo para leer opción"""
    id: int
    question_id: int
    created_at: str
    updated_at: Optional[str] = None

class OptionUpdate(SQLModel):
    """Modelo para actualizar opción"""
    text: Optional[str] = Field(default=None, max_length=500)
    is_correct: Optional[bool] = None
    order_index: Optional[int] = Field(default=None, ge=0)
