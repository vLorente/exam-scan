# Inicialización del paquete de modelos SQLModel

from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel

class TimestampMixin(SQLModel):
    """Mixin para añadir timestamps a los modelos"""
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default=None)

class BaseModel(TimestampMixin):
    """Modelo base con timestamps para todos los modelos"""
    pass
