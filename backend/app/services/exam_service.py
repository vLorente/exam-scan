"""
Servicio de lógica de negocio para exámenes
Maneja operaciones complejas que van más allá del CRUD básico
"""

from sqlmodel import Session, select
from app.models.exam import Exam, ExamStatus
from app.models.question import Question
from fastapi import HTTPException


class ExamService:
    
    @staticmethod
    def validate_exam_for_publication(exam_id: int, session: Session) -> bool:
        """
        Valida si un examen puede ser publicado
        - Debe tener al menos una pregunta
        - Todas las preguntas deben tener al menos 2 opciones
        """
        exam = session.get(Exam, exam_id)
        if not exam:
            raise HTTPException(status_code=404, detail="Exam not found")
        
        # Verificar que tenga preguntas
        questions = session.exec(
            select(Question).where(Question.exam_id == exam_id)
        ).all()
        
        if not questions:
            return False
        
        # TODO: Verificar que cada pregunta tenga al menos 2 opciones
        # Esto lo implementaremos cuando tengamos el modelo Option
        
        return True
    
    @staticmethod
    def publish_exam(exam_id: int, session: Session) -> Exam:
        """
        Publica un examen después de validar que cumple los requisitos
        """
        if not ExamService.validate_exam_for_publication(exam_id, session):
            raise HTTPException(
                status_code=400, 
                detail="Exam cannot be published: must have at least one question"
            )
        
        exam = session.get(Exam, exam_id)
        if not exam:
            raise HTTPException(status_code=404, detail="Exam not found")
            
        exam.status = ExamStatus.PUBLISHED
        session.add(exam)
        session.commit()
        session.refresh(exam)
        
        return exam
    
    @staticmethod
    def archive_exam(exam_id: int, session: Session) -> Exam:
        """
        Archiva un examen
        """
        exam = session.get(Exam, exam_id)
        if not exam:
            raise HTTPException(status_code=404, detail="Exam not found")
        
        exam.status = ExamStatus.ARCHIVED
        session.add(exam)
        session.commit()
        session.refresh(exam)
        
        return exam
    
    @staticmethod
    def get_exam_statistics(exam_id: int, session: Session) -> dict:
        """
        Obtiene estadísticas de un examen
        - Número de preguntas
        - Número de sesiones completadas
        - Promedio de puntuación
        """
        exam = session.get(Exam, exam_id)
        if not exam:
            raise HTTPException(status_code=404, detail="Exam not found")
        
        questions_count = len(session.exec(
            select(Question).where(Question.exam_id == exam_id)
        ).all())
        
        # TODO: Implementar estadísticas de sesiones cuando tengamos el modelo Session
        
        return {
            "exam_id": exam_id,
            "title": exam.title,
            "questions_count": questions_count,
            "sessions_completed": 0,  # TODO: calcular cuando tengamos sessions
            "average_score": 0.0,     # TODO: calcular cuando tengamos sessions
            "status": exam.status,
            "is_public": exam.is_public
        }
