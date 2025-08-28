# Inicialización del paquete de modelos SQLModel

# Importar todos los modelos para que SQLModel los registre
from .base import BaseModel, TimestampMixin
from .user import User, UserCreate, UserRead, UserUpdate, UserRole
from .auth import LoginResponse
from .exam import Exam, ExamCreate, ExamRead, ExamReadWithCreator, ExamReadWithQuestions, ExamUpdate, ExamStatus, ExamType
from .question import Question, QuestionCreate, QuestionRead, QuestionReadWithOptions, QuestionUpdate, QuestionType, QuestionDifficulty
from .question import Option, OptionCreate, OptionRead, OptionUpdate
from .session import ExamSession, ExamSessionCreate, ExamSessionRead, ExamSessionReadWithExam, ExamSessionReadWithAnswers, ExamSessionUpdate, SessionStatus
from .session import StudentAnswer, StudentAnswerCreate, StudentAnswerRead, StudentAnswerReadWithDetails, StudentAnswerUpdate
from .tag import Tag, TagCreate, TagRead, TagUpdate

# Exportar todos los modelos
__all__ = [
    # Base
    "BaseModel", "TimestampMixin",
    # User
    "User", "UserCreate", "UserRead", "UserUpdate", "UserRole",
    # Auth
    "LoginResponse",
    # Exam  
    "Exam", "ExamCreate", "ExamRead", "ExamReadWithCreator", "ExamReadWithQuestions", "ExamUpdate", "ExamStatus", "ExamType",
    # Question & Option
    "Question", "QuestionCreate", "QuestionRead", "QuestionReadWithOptions", "QuestionUpdate", "QuestionType", "QuestionDifficulty",
    "Option", "OptionCreate", "OptionRead", "OptionUpdate",
    # Session & StudentAnswer
    "ExamSession", "ExamSessionCreate", "ExamSessionRead", "ExamSessionReadWithExam", "ExamSessionReadWithAnswers", "ExamSessionUpdate", "SessionStatus",
    "StudentAnswer", "StudentAnswerCreate", "StudentAnswerRead", "StudentAnswerReadWithDetails", "StudentAnswerUpdate",
    # Tag
    "Tag", "TagCreate", "TagRead", "TagUpdate",
]
