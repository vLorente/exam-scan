from typing import Optional, List, TYPE_CHECKING
from sqlmodel import Field, SQLModel, Relationship
from .base import BaseModel

if TYPE_CHECKING:
    from .exam import Exam

class TagBase(SQLModel):
    """Modelo base para Tag - campos compartidos"""
    name: str = Field(max_length=50, index=True, unique=True)
    description: Optional[str] = Field(default=None, max_length=200)
    color: Optional[str] = Field(default=None, max_length=7)  # Hex color #FFFFFF

class Tag(TagBase, BaseModel, table=True):
    """Modelo de tabla para Tag"""
    id: Optional[int] = Field(default=None, primary_key=True)

class TagCreate(TagBase):
    """Modelo para crear etiqueta"""
    pass

class TagRead(TagBase):
    """Modelo para leer etiqueta"""
    id: int
    created_at: str
    updated_at: Optional[str] = None

class TagUpdate(SQLModel):
    """Modelo para actualizar etiqueta"""
    name: Optional[str] = Field(default=None, max_length=50)
    description: Optional[str] = Field(default=None, max_length=200)
    color: Optional[str] = Field(default=None, max_length=7)
