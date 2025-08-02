from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select, asc
from sqlalchemy.exc import IntegrityError
from app.core.database import get_session
from app.models.question import (
    Question, QuestionCreate, QuestionUpdate, QuestionRead, QuestionReadWithOptions,
    Option, OptionCreate, OptionUpdate, OptionRead
)
from app.services import QuestionService
from typing import List, Optional

router = APIRouter(prefix="/questions", tags=["questions"])

# =============================================================================
# CRUD PARA PREGUNTAS
# =============================================================================

@router.get("/", response_model=List[QuestionRead])
def list_questions(exam_id: Optional[int] = Query(None), session: Session = Depends(get_session)):
    """Listar preguntas, opcionalmente filtradas por examen"""
    query = select(Question)
    if exam_id:
        query = query.where(Question.exam_id == exam_id)
    return session.exec(query).all()

@router.get("/{question_id}", response_model=QuestionReadWithOptions)
def get_question(question_id: int, session: Session = Depends(get_session)):
    """Obtener una pregunta específica con sus opciones"""
    question = session.get(Question, question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question

@router.post("/", response_model=QuestionRead, status_code=status.HTTP_201_CREATED)
def create_question(question: QuestionCreate, exam_id: int, session: Session = Depends(get_session)):
    """Crear una nueva pregunta"""
    try:
        db_question = Question(**question.model_dump(), exam_id=exam_id)
        session.add(db_question)
        session.commit()
        session.refresh(db_question)
        return db_question
    except IntegrityError as e:
        session.rollback()
        if "fk_question_exam_id_exam" in str(e.orig):
            raise HTTPException(
                status_code=400, 
                detail="Invalid exam ID"
            )
        else:
            raise HTTPException(
                status_code=400, 
                detail="Database constraint violation"
            )

@router.put("/{question_id}", response_model=QuestionRead)
def update_question(question_id: int, question: QuestionUpdate, session: Session = Depends(get_session)):
    """Actualizar una pregunta existente"""
    db_question = session.get(Question, question_id)
    if not db_question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    question_data = question.model_dump(exclude_unset=True)
    for key, value in question_data.items():
        setattr(db_question, key, value)
    
    session.add(db_question)
    session.commit()
    session.refresh(db_question)
    return db_question

@router.delete("/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_question(question_id: int, session: Session = Depends(get_session)):
    """Eliminar una pregunta"""
    question = session.get(Question, question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    session.delete(question)
    session.commit()
    return None

# =============================================================================
# CRUD PARA OPCIONES
# =============================================================================

@router.get("/{question_id}/options", response_model=List[OptionRead])
def list_question_options(question_id: int, session: Session = Depends(get_session)):
    """Listar todas las opciones de una pregunta"""
    # Verificar que la pregunta existe
    question = session.get(Question, question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    options = session.exec(
        select(Option).where(Option.question_id == question_id).order_by(asc(Option.order_index))
    ).all()
    return options

@router.post("/{question_id}/options", response_model=OptionRead, status_code=status.HTTP_201_CREATED)
def create_option(question_id: int, option: OptionCreate, session: Session = Depends(get_session)):
    """Crear una nueva opción para una pregunta"""
    # Verificar que la pregunta existe
    question = session.get(Question, question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    try:
        db_option = Option(**option.model_dump(), question_id=question_id)
        session.add(db_option)
        session.commit()
        session.refresh(db_option)
        return db_option
    except IntegrityError as e:
        session.rollback()
        raise HTTPException(
            status_code=400, 
            detail="Database constraint violation"
        )

@router.get("/options/{option_id}", response_model=OptionRead)
def get_option(option_id: int, session: Session = Depends(get_session)):
    """Obtener una opción específica"""
    option = session.get(Option, option_id)
    if not option:
        raise HTTPException(status_code=404, detail="Option not found")
    return option

@router.put("/options/{option_id}", response_model=OptionRead)
def update_option(option_id: int, option: OptionUpdate, session: Session = Depends(get_session)):
    """Actualizar una opción existente"""
    db_option = session.get(Option, option_id)
    if not db_option:
        raise HTTPException(status_code=404, detail="Option not found")
    
    option_data = option.model_dump(exclude_unset=True)
    for key, value in option_data.items():
        setattr(db_option, key, value)
    
    session.add(db_option)
    session.commit()
    session.refresh(db_option)
    return db_option

@router.delete("/options/{option_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_option(option_id: int, session: Session = Depends(get_session)):
    """Eliminar una opción"""
    option = session.get(Option, option_id)
    if not option:
        raise HTTPException(status_code=404, detail="Option not found")
    
    session.delete(option)
    session.commit()
    return None

# =============================================================================
# ENDPOINTS DE LÓGICA DE NEGOCIO - Usando Services
# =============================================================================

@router.post("/{question_id}/validate")
def validate_question(question_id: int, session: Session = Depends(get_session)):
    """
    Valida si una pregunta cumple los requisitos usando QuestionService
    """
    return QuestionService.validate_question_structure(question_id, session)

@router.post("/{question_id}/auto-fix")
def auto_fix_question(question_id: int, session: Session = Depends(get_session)):
    """
    Intenta corregir automáticamente problemas comunes en una pregunta
    """
    return QuestionService.auto_fix_question(question_id, session)

@router.get("/exam/{exam_id}/validate-all")
def validate_all_exam_questions(exam_id: int, session: Session = Depends(get_session)):
    """
    Valida todas las preguntas de un examen
    """
    return QuestionService.bulk_validate_exam_questions(exam_id, session)

@router.post("/exam/{exam_id}/reorder")
def reorder_exam_questions(exam_id: int, question_ids: List[int], session: Session = Depends(get_session)):
    """
    Reordena las preguntas de un examen
    """
    return QuestionService.reorder_questions(exam_id, question_ids, session)
