from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import settings
from app.api.v1.routers import upload, questions, exams  # importa los routers (cuando estén listos)

app = FastAPI(
    title="Exam Scan API",
    description="API para procesar exámenes tipo test mediante IA",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(upload.router, prefix="/api/v1/upload", tags=["upload"])
app.include_router(questions.router, prefix="/api/v1/questions", tags=["questions"])
app.include_router(exams.router, prefix="/api/v1/exams", tags=["exams"])
