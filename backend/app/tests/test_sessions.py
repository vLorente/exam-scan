"""
Tests para sesiones de examen - CRUD y servicios
"""

import pytest
from sqlmodel import Session
from app.models.user import User
from app.models.exam import Exam, ExamStatus
from app.models.session import ExamSession, SessionStatus
from app.models.question import Question
from app.services import SessionService


@pytest.fixture(name="published_exam")
def published_exam_fixture(session: Session, sample_user: User):
    """Crear un examen publicado de prueba"""
    exam = Exam(
        title="Published Exam",
        subject="Mathematics",
        creator_id=sample_user.id,
        status=ExamStatus.PUBLISHED,
        max_attempts=3,
        duration_minutes=60
    )
    session.add(exam)
    session.commit()
    session.refresh(exam)
    
    # Agregar una pregunta para que sea válido
    question = Question(
        exam_id=exam.id,
        text="What is 2+2?",
        question_type="multiple_choice",
        points=1.0
    )
    session.add(question)
    session.commit()
    
    return exam


@pytest.fixture(name="draft_exam")
def draft_exam_fixture(session: Session, sample_user: User):
    """Crear un examen en borrador de prueba"""
    exam = Exam(
        title="Draft Exam",
        subject="Mathematics",
        creator_id=sample_user.id,
        status=ExamStatus.DRAFT
    )
    session.add(exam)
    session.commit()
    session.refresh(exam)
    return exam


class TestSessionService:
    """Tests para SessionService - lógica de negocio de sesiones"""
    
    def test_can_start_exam_success(self, session: Session, sample_user: User, published_exam: Exam):
        """Test que usuario puede iniciar examen publicado"""
        # Verificar que puede iniciar
        if sample_user.id is not None and published_exam.id is not None:
            can_start, reason = SessionService.can_start_exam(sample_user.id, published_exam.id, session)
            assert can_start is True
            assert "can start exam" in reason.lower()
    
    def test_can_start_exam_not_published(self, session: Session, sample_user: User, draft_exam: Exam):
        """Test que usuario no puede iniciar examen no publicado"""
        # Verificar que no puede iniciar
        if sample_user.id is not None and draft_exam.id is not None:
            can_start, reason = SessionService.can_start_exam(sample_user.id, draft_exam.id, session)
            assert can_start is False
            assert "not published" in reason.lower()
    
    def test_can_start_exam_max_attempts_reached(self, session: Session, sample_user: User, published_exam: Exam):
        """Test que usuario no puede iniciar examen si alcanzó máximo de intentos"""
        if sample_user.id is None or published_exam.id is None:
            return
            
        # Crear sesiones previas hasta alcanzar el máximo
        for i in range(published_exam.max_attempts):
            exam_session = ExamSession(
                student_id=sample_user.id,
                exam_id=published_exam.id,
                status=SessionStatus.COMPLETED,
                attempt_number=i + 1
            )
            session.add(exam_session)
        session.commit()
        
        # Verificar que no puede iniciar más
        can_start, reason = SessionService.can_start_exam(sample_user.id, published_exam.id, session)
        assert can_start is False
        assert "maximum attempts" in reason.lower()
    
    def test_can_start_exam_active_session_exists(self, session: Session, sample_user: User, published_exam: Exam):
        """Test que usuario no puede iniciar examen si ya tiene sesión activa"""
        if sample_user.id is None or published_exam.id is None:
            return
            
        # Crear sesión activa
        active_session = ExamSession(
            student_id=sample_user.id,
            exam_id=published_exam.id,
            status=SessionStatus.IN_PROGRESS
        )
        session.add(active_session)
        session.commit()
        
        # Verificar que no puede iniciar otra
        can_start, reason = SessionService.can_start_exam(sample_user.id, published_exam.id, session)
        assert can_start is False
        assert "already an active session" in reason.lower()
    
    def test_start_exam_session_success(self, session: Session, sample_user: User, published_exam: Exam):
        """Test iniciar sesión de examen exitosamente"""
        if sample_user.id is None or published_exam.id is None:
            return
            
        # Iniciar sesión
        exam_session = SessionService.start_exam_session(sample_user.id, published_exam.id, session)
        
        assert exam_session.student_id == sample_user.id
        assert exam_session.exam_id == published_exam.id
        assert exam_session.status == SessionStatus.IN_PROGRESS
        assert exam_session.end_time is not None  # Tiene límite de tiempo por duration_minutes
        assert exam_session.start_time is not None
    
    def test_start_exam_session_without_time_limit(self, session: Session, sample_user: User, published_exam: Exam):
        """Test iniciar sesión sin límite de tiempo"""
        if published_exam.id is None:
            return
            
        # Quitar límite de tiempo
        published_exam.duration_minutes = None
        session.add(published_exam)
        session.commit()
        
        if sample_user.id is not None:
            # Iniciar sesión
            exam_session = SessionService.start_exam_session(sample_user.id, published_exam.id, session)
            
            assert exam_session.end_time is None  # Sin límite de tiempo
    
    def test_finish_exam_session(self, session: Session, sample_user: User, published_exam: Exam):
        """Test finalizar sesión de examen"""
        if sample_user.id is None or published_exam.id is None:
            return
            
        # Crear sesión activa
        exam_session = ExamSession(
            student_id=sample_user.id,
            exam_id=published_exam.id,
            status=SessionStatus.IN_PROGRESS
        )
        session.add(exam_session)
        session.commit()
        session.refresh(exam_session)
        
        if exam_session.id is not None:
            # Finalizar sesión
            finished_session = SessionService.finish_exam_session(exam_session.id, session)
            
            assert finished_session.status == SessionStatus.COMPLETED
            assert finished_session.end_time is not None
            assert finished_session.score is not None  # Aunque sea 0.0 por ahora
    
    def test_finish_exam_session_not_in_progress(self, session: Session, sample_user: User, published_exam: Exam):
        """Test que no se puede finalizar sesión que no está en progreso"""
        if sample_user.id is None or published_exam.id is None:
            return
            
        # Crear sesión ya completada
        exam_session = ExamSession(
            student_id=sample_user.id,
            exam_id=published_exam.id,
            status=SessionStatus.COMPLETED
        )
        session.add(exam_session)
        session.commit()
        session.refresh(exam_session)
        
        if exam_session.id is not None:
            # Intentar finalizar debe fallar
            with pytest.raises(Exception) as exc_info:
                SessionService.finish_exam_session(exam_session.id, session)
            
            assert "not in progress" in str(exc_info.value).lower()
    
    def test_get_user_exam_history(self, session: Session, sample_user: User, published_exam: Exam):
        """Test obtener historial de sesiones de usuario"""
        if sample_user.id is None or published_exam.id is None:
            return
            
        # Crear varias sesiones
        session1 = ExamSession(
            student_id=sample_user.id,
            exam_id=published_exam.id,
            status=SessionStatus.COMPLETED,
            score=85.0
        )
        session2 = ExamSession(
            student_id=sample_user.id,
            exam_id=published_exam.id,
            status=SessionStatus.COMPLETED,
            score=92.0
        )
        session.add_all([session1, session2])
        session.commit()
        
        # Obtener historial
        history = SessionService.get_user_exam_history(sample_user.id, published_exam.id, session)
        
        assert len(history) == 2
        # Debería estar ordenado por fecha descendente (más reciente primero)
        assert all(isinstance(s, ExamSession) for s in history)
        assert all(s.student_id == sample_user.id for s in history)
        assert all(s.exam_id == published_exam.id for s in history)
    
    def test_get_session_time_remaining_no_limit(self, session: Session, sample_user: User, published_exam: Exam):
        """Test tiempo restante cuando no hay límite"""
        if sample_user.id is None or published_exam.id is None:
            return
            
        # Quitar límite de tiempo
        published_exam.duration_minutes = None
        session.add(published_exam)
        session.commit()
        
        # Crear sesión activa
        exam_session = ExamSession(
            student_id=sample_user.id,
            exam_id=published_exam.id,
            status=SessionStatus.IN_PROGRESS
        )
        session.add(exam_session)
        session.commit()
        session.refresh(exam_session)
        
        if exam_session.id is not None:
            # Verificar que no hay límite
            time_remaining = SessionService.get_session_time_remaining(exam_session.id, session)
            assert time_remaining is None
    
    def test_get_session_time_remaining_with_limit(self, session: Session, sample_user: User, published_exam: Exam):
        """Test tiempo restante con límite"""
        if sample_user.id is None or published_exam.id is None:
            return
            
        # Iniciar sesión (que tendrá límite de tiempo)
        exam_session = SessionService.start_exam_session(sample_user.id, published_exam.id, session)
        
        if exam_session.id is not None:
            # Verificar que hay tiempo restante
            time_remaining = SessionService.get_session_time_remaining(exam_session.id, session)
            assert time_remaining is not None
            if published_exam.duration_minutes is not None:
                assert time_remaining <= published_exam.duration_minutes
            assert time_remaining >= 0
