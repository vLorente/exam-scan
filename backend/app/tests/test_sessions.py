"""
Tests para sesiones de examen - CRUD y servicios
"""

import pytest
from sqlmodel import Session
from app.models.user import User
from app.models.exam import Exam, ExamStatus
from app.models.session import ExamSession, SessionStatus
from app.models.question import Question
from app.services.session_service import SessionService
from fastapi.testclient import TestClient
from app.main import app


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


class TestSessionCRUD:
    """Tests para CRUD de sesiones de examen"""
    
    def test_create_exam_session(self, session: Session, sample_user: User, published_exam: Exam, client: TestClient):
        """Test crear sesión de examen con datos válidos"""
        if published_exam.id is None or sample_user.id is None:
            pytest.skip("Required IDs not available")
        
        response = client.post("/api/v1/sessions/", json={
            "exam_id": published_exam.id, 
            "student_id": sample_user.id
        })
        print(f"Response status: {response.status_code}")
        print(f"Response body: {response.text}")
        assert response.status_code == 201
        data = response.json()
        assert "id" in data
        assert data["exam_id"] == published_exam.id
        assert data["student_id"] == sample_user.id
        assert data["status"] == "in_progress"

    def test_create_session_invalid_exam(self, sample_user: User, client: TestClient):
        """Test crear sesión con examen inexistente"""
        if sample_user.id is None:
            pytest.skip("User ID not available")
        
        response = client.post("/api/v1/sessions/", json={
            "exam_id": 9999,  # ID inexistente
            "student_id": sample_user.id
        })
        assert response.status_code == 404
        assert "Exam not found" in response.json()["detail"]

    def test_create_session_invalid_user(self, published_exam: Exam, client: TestClient):
        """Test crear sesión con usuario inexistente"""
        if published_exam.id is None:
            pytest.skip("Exam ID not available")
        
        response = client.post("/api/v1/sessions/", json={
            "exam_id": published_exam.id,
            "student_id": 9999  # ID inexistente
        })
        assert response.status_code == 404
        assert "Student not found" in response.json()["detail"]

    def test_list_exam_sessions(self, client: TestClient):
        """Test listar sesiones"""
        response = client.get("/api/v1/sessions/")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_get_session_by_id(self, session: Session, sample_user: User, published_exam: Exam, client: TestClient):
        """Test obtener sesión por ID"""
        if published_exam.id is None or sample_user.id is None:
            pytest.skip("Required IDs not available")
        
        # Crear una sesión
        response = client.post("/api/v1/sessions/", json={
            "exam_id": published_exam.id,
            "student_id": sample_user.id
        })
        assert response.status_code == 201
        session_id = response.json()["id"]
        
        # Obtener la sesión
        response = client.get(f"/api/v1/sessions/{session_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == session_id
        assert data["exam_id"] == published_exam.id

    def test_get_session_not_found(self, client: TestClient):
        """Test obtener sesión inexistente"""
        response = client.get("/api/v1/sessions/9999")
        assert response.status_code == 404
        assert "Session not found" in response.json()["detail"]

    def test_finish_exam_session(self, session: Session, sample_user: User, published_exam: Exam, client: TestClient):
        """Test finalizar sesión"""
        if published_exam.id is None or sample_user.id is None:
            pytest.skip("Required IDs not available")
        
        # Crear una sesión
        response = client.post("/api/v1/sessions/", json={
            "exam_id": published_exam.id,
            "student_id": sample_user.id
        })
        assert response.status_code == 201
        session_id = response.json()["id"]
        
        # Finalizar la sesión
        response = client.post(f"/api/v1/sessions/{session_id}/finish")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "completed"
        assert "end_time" in data

    def test_get_time_remaining(self, session: Session, sample_user: User, published_exam: Exam, client: TestClient):
        """Test obtener tiempo restante"""
        if published_exam.id is None or sample_user.id is None:
            pytest.skip("Required IDs not available")
        
        # Crear una sesión
        response = client.post("/api/v1/sessions/", json={
            "exam_id": published_exam.id,
            "student_id": sample_user.id
        })
        assert response.status_code == 201
        session_id = response.json()["id"]
        
        # Obtener tiempo restante
        response = client.get(f"/api/v1/sessions/{session_id}/time-remaining")
        assert response.status_code == 200
        data = response.json()
        assert "time_remaining" in data
        assert isinstance(data["time_remaining"], int)

    def test_delete_exam_session(self, session: Session, sample_user: User, published_exam: Exam, client: TestClient):
        """Test eliminar sesión"""
        if published_exam.id is None or sample_user.id is None:
            pytest.skip("Required IDs not available")
        
        # Crear una sesión
        response = client.post("/api/v1/sessions/", json={
            "exam_id": published_exam.id,
            "student_id": sample_user.id
        })
        assert response.status_code == 201
        session_id = response.json()["id"]
        
        # Eliminar la sesión
        response = client.delete(f"/api/v1/sessions/{session_id}")
        assert response.status_code == 204


class TestStudentAnswerCRUD:
    """Tests para CRUD de respuestas de estudiantes"""
    
    def test_create_answer(self, session: Session, sample_user: User, published_exam: Exam, client: TestClient):
        """Test crear respuesta de estudiante"""
        if published_exam.id is None or sample_user.id is None:
            pytest.skip("Required IDs not available")
        
        # Crear una sesión primero
        session_resp = client.post("/api/v1/sessions/", json={
            "exam_id": published_exam.id,
            "student_id": sample_user.id
        })
        assert session_resp.status_code == 201
        session_id = session_resp.json()["id"]
        
        # Crear una respuesta
        response = client.post(f"/api/v1/sessions/{session_id}/answers", json={
            "question_id": 1,
            "selected_option_id": 1
        })
        assert response.status_code == 201
        data = response.json()
        assert data["question_id"] == 1
        assert data["selected_option_id"] == 1
        assert data["session_id"] == session_id

    def test_list_answers(self, session: Session, sample_user: User, published_exam: Exam, client: TestClient):
        """Test listar respuestas de una sesión"""
        if published_exam.id is None or sample_user.id is None:
            pytest.skip("Required IDs not available")
        
        # Crear una sesión
        session_resp = client.post("/api/v1/sessions/", json={
            "exam_id": published_exam.id,
            "student_id": sample_user.id
        })
        assert session_resp.status_code == 201
        session_id = session_resp.json()["id"]
        
        # Listar respuestas (inicialmente vacío)
        response = client.get(f"/api/v1/sessions/{session_id}/answers")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_create_answer_session_not_found(self, client: TestClient):
        """Test crear respuesta en sesión inexistente"""
        response = client.post("/api/v1/sessions/9999/answers", json={
            "question_id": 1,
            "selected_option_id": 1
        })
        assert response.status_code == 404
        assert "Session not found" in response.json()["detail"]

    def test_update_answer(self, session: Session, sample_user: User, published_exam: Exam, client: TestClient):
        """Test actualizar respuesta"""
        if published_exam.id is None or sample_user.id is None:
            pytest.skip("Required IDs not available")
        
        # Crear sesión y respuesta
        session_resp = client.post("/api/v1/sessions/", json={
            "exam_id": published_exam.id,
            "student_id": sample_user.id
        })
        assert session_resp.status_code == 201
        session_id = session_resp.json()["id"]
        
        answer_resp = client.post(f"/api/v1/sessions/{session_id}/answers", json={
            "question_id": 1,
            "selected_option_id": 1
        })
        assert answer_resp.status_code == 201
        answer_id = answer_resp.json()["id"]
        
        # Actualizar respuesta
        response = client.put(f"/api/v1/sessions/{session_id}/answers/{answer_id}", json={
            "selected_option_id": 2
        })
        assert response.status_code == 200
        data = response.json()
        assert data["selected_option_id"] == 2

    def test_delete_answer(self, session: Session, sample_user: User, published_exam: Exam, client: TestClient):
        """Test eliminar respuesta"""
        if published_exam.id is None or sample_user.id is None:
            pytest.skip("Required IDs not available")
        
        # Crear sesión y respuesta
        session_resp = client.post("/api/v1/sessions/", json={
            "exam_id": published_exam.id,
            "student_id": sample_user.id
        })
        assert session_resp.status_code == 201
        session_id = session_resp.json()["id"]
        
        answer_resp = client.post(f"/api/v1/sessions/{session_id}/answers", json={
            "question_id": 1,
            "selected_option_id": 1
        })
        assert answer_resp.status_code == 201
        answer_id = answer_resp.json()["id"]
        
        # Eliminar respuesta
        response = client.delete(f"/api/v1/sessions/{session_id}/answers/{answer_id}")
        assert response.status_code == 204


class TestSessionService:
    """Tests para SessionService - lógica de negocio de sesiones"""
    
    def test_can_start_exam_success(self, session: Session, sample_user: User, published_exam: Exam):
        """Test que usuario puede iniciar examen publicado"""
        if sample_user.id is None or published_exam.id is None:
            pytest.skip("Required IDs not available")
        
        can_start, reason = SessionService.can_start_exam(sample_user.id, published_exam.id, session)
        assert can_start is True
        assert "can start exam" in reason.lower()
    
    def test_can_start_exam_not_published(self, session: Session, sample_user: User, draft_exam: Exam):
        """Test que usuario no puede iniciar examen no publicado"""
        if sample_user.id is None or draft_exam.id is None:
            pytest.skip("Required IDs not available")
        
        can_start, reason = SessionService.can_start_exam(sample_user.id, draft_exam.id, session)
        assert can_start is False
        assert "not published" in reason.lower()
    
    def test_can_start_exam_max_attempts_reached(self, session: Session, sample_user: User, published_exam: Exam):
        """Test que usuario no puede iniciar examen si alcanzó máximo de intentos"""
        if sample_user.id is None or published_exam.id is None:
            pytest.skip("Required IDs not available")
            
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
    
    def test_start_exam_session_success(self, session: Session, sample_user: User, published_exam: Exam):
        """Test iniciar sesión de examen exitosamente"""
        if sample_user.id is None or published_exam.id is None:
            pytest.skip("Required IDs not available")
        
        exam_session = SessionService.start_exam_session(sample_user.id, published_exam.id, session)
        
        assert exam_session is not None
        assert exam_session.student_id == sample_user.id
        assert exam_session.exam_id == published_exam.id
        assert exam_session.status == SessionStatus.IN_PROGRESS
        assert exam_session.attempt_number >= 1