"""
Servicio de lógica de negocio para sesiones de examen
Maneja la ejecución de exámenes y el cálculo de puntuaciones
"""

from sqlmodel import Session, select, desc
from app.models.session import ExamSession, SessionStatus
from app.models.exam import Exam, ExamStatus
from app.models.user import User
from fastapi import HTTPException
from datetime import datetime, timedelta
from typing import Optional, List


class SessionService:
    
    @staticmethod
    def can_start_exam(user_id: int, exam_id: int, session: Session) -> tuple[bool, str]:
        """
        Verifica si un usuario puede iniciar un examen
        Retorna (puede_iniciar, razón_si_no_puede)
        """
        exam = session.get(Exam, exam_id)
        if not exam:
            return False, "Exam not found"
        
        if exam.status != ExamStatus.PUBLISHED:
            return False, "Exam is not published"
        
        # Verificar intentos previos
        previous_sessions = session.exec(
            select(ExamSession).where(
                ExamSession.student_id == user_id,
                ExamSession.exam_id == exam_id
            )
        ).all()
        
        if len(previous_sessions) >= exam.max_attempts:
            return False, f"Maximum attempts ({exam.max_attempts}) reached"
        
        # Verificar si hay una sesión activa
        active_session = session.exec(
            select(ExamSession).where(
                ExamSession.student_id == user_id,
                ExamSession.exam_id == exam_id,
                ExamSession.status == SessionStatus.IN_PROGRESS
            )
        ).first()
        
        if active_session:
            return False, "There is already an active session for this exam"
        
        return True, "Can start exam"
    
    @staticmethod
    def start_exam_session(user_id: int, exam_id: int, session: Session) -> ExamSession:
        """
        Inicia una nueva sesión de examen
        """
        can_start, reason = SessionService.can_start_exam(user_id, exam_id, session)
        if not can_start:
            raise HTTPException(status_code=400, detail=reason)
        
        exam = session.get(Exam, exam_id)
        if not exam:
            raise HTTPException(status_code=404, detail="Exam not found")
        
        # Calcular tiempo de finalización si el examen tiene duración
        end_time = None
        if exam.duration_minutes:
            end_time = datetime.utcnow() + timedelta(minutes=float(exam.duration_minutes))
        
        exam_session = ExamSession(
            student_id=user_id,
            exam_id=exam_id,
            status=SessionStatus.IN_PROGRESS,
            start_time=datetime.utcnow(),
            end_time=end_time
        )
        
        session.add(exam_session)
        session.commit()
        session.refresh(exam_session)
        
        return exam_session
    
    @staticmethod
    def finish_exam_session(session_id: int, session: Session) -> ExamSession:
        """
        Finaliza una sesión de examen y calcula la puntuación
        """
        exam_session = session.get(ExamSession, session_id)
        if not exam_session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        if exam_session.status != SessionStatus.IN_PROGRESS:
            raise HTTPException(status_code=400, detail="Session is not in progress")
        
        # TODO: Calcular puntuación basada en las respuestas
        # Esto lo implementaremos cuando tengamos el modelo Answer
        
        exam_session.status = SessionStatus.COMPLETED
        exam_session.end_time = datetime.utcnow()
        exam_session.score = 0.0  # TODO: calcular puntuación real
        
        session.add(exam_session)
        session.commit()
        session.refresh(exam_session)
        
        return exam_session
    
    @staticmethod
    def get_session_time_remaining(session_id: int, session: Session) -> Optional[int]:
        """
        Obtiene el tiempo restante en minutos para una sesión activa
        Retorna None si no hay límite de tiempo
        """
        exam_session = session.get(ExamSession, session_id)
        if not exam_session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        if exam_session.status != SessionStatus.IN_PROGRESS:
            return None
        
        if not exam_session.end_time:
            return None  # Sin límite de tiempo
        
        now = datetime.utcnow()
        if now >= exam_session.end_time:
            # Tiempo agotado, finalizar sesión automáticamente
            SessionService.finish_exam_session(session_id, session)
            return 0
        
        time_remaining = exam_session.end_time - now
        return int(time_remaining.total_seconds() / 60)  # minutos restantes
    
    @staticmethod
    def get_user_exam_history(user_id: int, exam_id: int, session: Session) -> List[ExamSession]:
        """
        Obtiene el historial de sesiones de un usuario para un examen específico
        """
        sessions = session.exec(
            select(ExamSession).where(
                ExamSession.student_id == user_id,
                ExamSession.exam_id == exam_id
            ).order_by(desc(ExamSession.start_time))
        ).all()
        
        return list(sessions)
