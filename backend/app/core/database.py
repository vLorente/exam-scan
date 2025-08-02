from sqlmodel import SQLModel, create_engine, Session
from typing import Generator

# Import settings with relative import to avoid circular dependencies
from .config import settings

# Create SQLModel engine
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_pre_ping=True,
    pool_recycle=300,
)

def create_db_and_tables():
    """Create database tables"""
    SQLModel.metadata.create_all(engine)

def get_session() -> Generator[Session, None, None]:
    """Dependency to get database session"""
    session = Session(engine)
    try:
        yield session
    finally:
        session.close()
