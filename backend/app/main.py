from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator

from app.core.config import settings
from app.core.database import create_db_and_tables
# from app.api.v1.router import api_router

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

# Endpoints para metricas de prometheus
instrumentator = Instrumentator()
instrumentator.instrument(app).expose(app, include_in_schema=False)

# Create database tables on startup
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Include API routers
# app.include_router(api_router, prefix="/api/v1")

# Test inicial, elimina cuando tengas tus propios endpoints
@app.get("/")
def read_root():
    return {"message": "Exam Scan API is running!"}
