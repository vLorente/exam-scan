from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    APP_NAME: str = "exam-scan"
    DEBUG: bool = False
    ENV: str = "development"
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    DATABASE_URL: str = "postgresql+psycopg2://user:password@localhost:5432/exams"
    SECRET_KEY: str = "your-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    ALLOWED_ORIGINS: List[str] = ["*"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8"
    )

settings = Settings()
