"""
API endpoints para gestión de sesiones de examen y respuestas de estudiantes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from app.core.database import get_session
from app.models.session import (
    ExamSession, ExamSessionCreate, ExamSessionRead, ExamSessionUpdate, SessionStatus,
    StudentAnswer, StudentAnswerCreate, StudentAnswerRead, StudentAnswerUpdate,
    SessionFinishResponse, TimeRemainingResponse
)
from app.models.exam import Exam
from app.models.user import User
from app.services.session_service import SessionService

router = APIRouter(prefix="/sessions", tags=["sessions"])

# =============================
# CRUD ExamSession
# =============================

@router.get("/", response_model=List[ExamSessionRead])
def list_sessions(session: Session = Depends(get_session)):
    """Listar todas las sesiones de examen"""
    sessions = session.exec(select(ExamSession)).all()
    return sessions

@router.get("/{session_id}", response_model=ExamSessionRead)
def get_session(session_id: int, session: Session = Depends(get_session)):
    """Obtener una sesión específica"""
    db_session = session.get(ExamSession, session_id)
    if not db_session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return db_session

@router.post("/", status_code=201, response_model=ExamSessionRead)
def create_session(session_create: ExamSessionCreate, session: Session = Depends(get_session)):
    """Crear una nueva sesión de examen"""
    # Verificar que el examen existe
    exam = session.get(Exam, session_create.exam_id)
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    
    # Verificar que el usuario existe
    user = session.get(User, session_create.student_id)
    if not user:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Verificar si el usuario puede iniciar el examen
    can_start, reason = SessionService.can_start_exam(session_create.student_id, session_create.exam_id, session)
    if not can_start:
        raise HTTPException(status_code=400, detail=reason)
    
    # Crear la sesión usando el servicio
    exam_session = SessionService.start_exam_session(session_create.student_id, session_create.exam_id, session)
    
    return exam_session

@router.put("/{session_id}", response_model=ExamSessionRead)
def update_session(session_id: int, session_update: ExamSessionUpdate, session: Session = Depends(get_session)):
    """Actualizar una sesión de examen"""
    db_session = session.get(ExamSession, session_id)
    if not db_session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Actualizar campos proporcionados
    update_data = session_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_session, field, value)
    
    session.add(db_session)
    session.commit()
    session.refresh(db_session)
    
    return db_session

@router.delete("/{session_id}", status_code=204)
def delete_session(session_id: int, session: Session = Depends(get_session)):
    """Eliminar una sesión de examen"""
    db_session = session.get(ExamSession, session_id)
    if not db_session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session.delete(db_session)
    session.commit()

# =============================
# Endpoints de lógica de negocio para sesiones
# =============================

@router.post("/{session_id}/finish", response_model=SessionFinishResponse)
def finish_session(session_id: int, session: Session = Depends(get_session)):
    """Finalizar una sesión de examen y calcular puntuación"""
    try:
        finished_session = SessionService.finish_exam_session(session_id, session)
        return SessionFinishResponse(
            id=finished_session.id,
            status=finished_session.status,
            end_time=finished_session.end_time,
            score=finished_session.score,
            earned_points=finished_session.earned_points,
            total_points=finished_session.total_points
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{session_id}/time-remaining", response_model=TimeRemainingResponse)
def get_time_remaining(session_id: int, session: Session = Depends(get_session)):
    """Obtener tiempo restante en una sesión"""
    try:
        time_remaining = SessionService.get_session_time_remaining(session_id, session)
        return TimeRemainingResponse(time_remaining=time_remaining)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

# =============================
# CRUD StudentAnswer
# =============================

@router.get("/{session_id}/answers", response_model=List[StudentAnswerRead])
def list_answers(session_id: int, session: Session = Depends(get_session)):
    """Listar respuestas de una sesión"""
    # Verificar que la sesión existe
    db_session = session.get(ExamSession, session_id)
    if not db_session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    answers = session.exec(
        select(StudentAnswer).where(StudentAnswer.session_id == session_id)
    ).all()
    
    return answers

@router.post("/{session_id}/answers", status_code=201, response_model=StudentAnswerRead)
def create_answer(session_id: int, answer_create: StudentAnswerCreate, session: Session = Depends(get_session)):
    """Crear una respuesta de estudiante"""
    # Verificar que la sesión existe y está activa
    db_session = session.get(ExamSession, session_id)
    if not db_session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if db_session.status != SessionStatus.IN_PROGRESS:
        raise HTTPException(status_code=400, detail="Session is not in progress")
    
    # Crear la respuesta
    answer = StudentAnswer(
        session_id=session_id,
        question_id=answer_create.question_id,
        selected_option_id=answer_create.selected_option_id
    )
    
    session.add(answer)
    session.commit()
    session.refresh(answer)
    
    return answer

@router.put("/{session_id}/answers/{answer_id}", response_model=StudentAnswerRead)
def update_answer(
    session_id: int, 
    answer_id: int, 
    answer_update: StudentAnswerUpdate, 
    session: Session = Depends(get_session)
):
    """Actualizar una respuesta de estudiante"""
    # Verificar que la sesión existe y está activa
    db_session = session.get(ExamSession, session_id)
    if not db_session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if db_session.status != SessionStatus.IN_PROGRESS:
        raise HTTPException(status_code=400, detail="Session is not in progress")
    
    # Verificar que la respuesta existe y pertenece a la sesión
    answer = session.get(StudentAnswer, answer_id)
    if not answer or answer.session_id != session_id:
        raise HTTPException(status_code=404, detail="Answer not found")
    
    # Actualizar campos proporcionados
    update_data = answer_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(answer, field, value)
    
    session.add(answer)
    session.commit()
    session.refresh(answer)
    
    return answer

@router.delete("/{session_id}/answers/{answer_id}", status_code=204)
def delete_answer(session_id: int, answer_id: int, session: Session = Depends(get_session)):
    """Eliminar una respuesta de estudiante"""
    # Verificar que la sesión existe y está activa
    db_session = session.get(ExamSession, session_id)
    if not db_session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if db_session.status != SessionStatus.IN_PROGRESS:
        raise HTTPException(status_code=400, detail="Session is not in progress")
    
    # Verificar que la respuesta existe y pertenece a la sesión
    answer = session.get(StudentAnswer, answer_id)
    if not answer or answer.session_id != session_id:
        raise HTTPException(status_code=404, detail="Answer not found")
    
    session.delete(answer)
    session.commit()
