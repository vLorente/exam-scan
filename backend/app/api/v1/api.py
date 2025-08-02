from fastapi import APIRouter
from .routers import auth

api_router = APIRouter()

# Include auth router
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
