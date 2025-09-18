from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from sqlalchemy.exc import IntegrityError
from app.core.database import get_session
from app.models.exam import Exam, ExamCreate, ExamUpdate, ExamRead
from app.services import ExamService
from typing import List

router = APIRouter(prefix="/exams", tags=["exams"])

@router.get("/", response_model=List[ExamRead])
def list_exams(session: Session = Depends(get_session)):
    """Listar todos los exámenes"""
    return session.exec(select(Exam)).all()

@router.get("/{exam_id}", response_model=ExamRead)
def get_exam(exam_id: int, session: Session = Depends(get_session)):
    """Obtener un examen específico"""
    exam = session.get(Exam, exam_id)
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    return exam

@router.post("/", response_model=ExamRead, status_code=status.HTTP_201_CREATED)
def create_exam(exam: ExamCreate, session: Session = Depends(get_session)):
    """Crear un nuevo examen"""
    try:
        # TODO: Obtener creator_id del usuario autenticado
        # Por ahora usamos un valor temporal
        db_exam = Exam(**exam.model_dump(), creator_id=1)
        session.add(db_exam)
        session.commit()
        session.refresh(db_exam)
        return db_exam
    except IntegrityError as e:
        session.rollback()
        if "fk_exam_creator_id_user" in str(e.orig):
            raise HTTPException(
                status_code=400, 
                detail="Invalid creator ID"
            )
        else:
            raise HTTPException(
                status_code=400, 
                detail="Database constraint violation"
            )

@router.put("/{exam_id}", response_model=ExamRead)
def update_exam(exam_id: int, exam: ExamUpdate, session: Session = Depends(get_session)):
    """Actualizar un examen existente"""
    db_exam = session.get(Exam, exam_id)
    if not db_exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    
    exam_data = exam.model_dump(exclude_unset=True)
    for key, value in exam_data.items():
        setattr(db_exam, key, value)
    
    session.add(db_exam)
    session.commit()
    session.refresh(db_exam)
    return db_exam

@router.delete("/{exam_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_exam(exam_id: int, session: Session = Depends(get_session)):
    """Eliminar un examen"""
    exam = session.get(Exam, exam_id)
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    
    session.delete(exam)
    session.commit()
    return None

# =============================================================================
# ENDPOINTS DE LÓGICA DE NEGOCIO - Usando Services
# =============================================================================

@router.post("/{exam_id}/publish", response_model=ExamRead)
def publish_exam(exam_id: int, session: Session = Depends(get_session)):
    """
    Publica un examen después de validar que cumple los requisitos
    Usa ExamService para lógica de negocio compleja
    """
    return ExamService.publish_exam(exam_id, session)

@router.post("/{exam_id}/archive", response_model=ExamRead)
def archive_exam(exam_id: int, session: Session = Depends(get_session)):
    """
    Archiva un examen
    Usa ExamService para lógica de negocio
    """
    return ExamService.archive_exam(exam_id, session)

@router.get("/{exam_id}/statistics")
def get_exam_statistics(exam_id: int, session: Session = Depends(get_session)):
    """
    Obtiene estadísticas detalladas de un examen
    Usa ExamService para cálculos complejos
    """
    return ExamService.get_exam_statistics(exam_id, session)

@router.get("/{exam_id}/validate")
def validate_exam_for_publication(exam_id: int, session: Session = Depends(get_session)):
    """
    Valida si un examen puede ser publicado sin publicarlo
    Usa ExamService para validaciones de negocio
    """
    can_publish = ExamService.validate_exam_for_publication(exam_id, session)
    return {
        "exam_id": exam_id,
        "can_publish": can_publish,
        "message": "Exam is ready for publication" if can_publish else "Exam needs at least one question"
    }
