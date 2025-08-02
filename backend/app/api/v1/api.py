from fastapi import APIRouter
from .routers import auth, users, exams, questions

api_router = APIRouter()

# Include auth router
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
# Include users router
api_router.include_router(users.router)
# Include exams router
api_router.include_router(exams.router)
# Include questions router
api_router.include_router(questions.router)
