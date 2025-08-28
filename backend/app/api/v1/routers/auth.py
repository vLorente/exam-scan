from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.core.security import create_access_token, verify_password, get_password_hash
from app.models.user import User, UserCreate, UserRead, UserLogin
from app.models.auth import LoginResponse
from app.api.deps import get_session, get_current_user

router = APIRouter(tags=["auth"])

@router.post("/register", response_model=UserRead)
def register(user_in: UserCreate, session: Session = Depends(get_session)):
    existing = session.exec(select(User).where(User.email == user_in.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    
    # Create user manually to handle password hashing
    user_data = user_in.model_dump(exclude={"password"})
    user = User(**user_data)
    user.hashed_password = get_password_hash(user_in.password)
    
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@router.post("/login", response_model=LoginResponse)
def login(form_data: UserLogin, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == form_data.email)).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    
    # Verificar que el usuario tenga ID (debe tenerlo si viene de la BD)
    if user.id is None:
        raise HTTPException(status_code=500, detail="Error interno del servidor")
    
    token = create_access_token(
        user_id=user.id,
        username=user.username,
        role=user.role.value
    )
    return LoginResponse(
        access_token=token,
        token_type="bearer",
        current_user=UserRead.model_validate(user)
    )

@router.get("/me", response_model=UserRead)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Endpoint protegido para obtener información del usuario actual"""
    return current_user
