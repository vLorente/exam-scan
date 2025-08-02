from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
from app.config.settings import settings
# from app.api.v1.routers import upload, questions, exams

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

# Incluir routers
# app.include_router(upload.router, prefix="/api/v1/upload", tags=["upload"])
# app.include_router(questions.router, prefix="/api/v1/questions", tags=["questions"])
# app.include_router(exams.router, prefix="/api/v1/exams", tags=["exams"])


# Test inicial, elimina cuando tengas tus propios endpoints
@app.get("/")
def read_root():
    return {"Hello": "World"}
