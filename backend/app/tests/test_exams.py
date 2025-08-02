"""
Tests para el CRUD de exámenes
Cubre operaciones básicas y lógica de negocio
"""

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session
from app.models.user import User
from app.models.exam import Exam, ExamStatus, ExamType
from app.models.question import Question
from app.services import ExamService


@pytest.fixture(name="sample_user")
def sample_user_fixture(session: Session):
    """Crear un usuario de prueba"""
    user = User(
        email="creator@example.com",
        username="creator",
        full_name="Exam Creator",
        hashed_password="hashedpassword123"
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@pytest.fixture(name="sample_exam_data")
def sample_exam_data_fixture():
    """Datos de examen de prueba"""
    return {
        "title": "Mathematics Test",
        "description": "Basic algebra and geometry",
        "subject": "Mathematics",
        "duration_minutes": 60,
        "max_attempts": 3,
        "passing_score": 70.0,
        "exam_type": "multiple_choice",
        "instructions": "Read carefully and choose the best answer"
    }


class TestExamsCRUD:
    """Tests para operaciones CRUD básicas de exámenes"""

    def test_create_exam(self, client: TestClient, sample_user: User, sample_exam_data: dict):
        """Test crear examen"""
        response = client.post("/api/v1/exams/", json=sample_exam_data)
        
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == sample_exam_data["title"]
        assert data["subject"] == sample_exam_data["subject"]
        assert data["status"] == "draft"
        assert "id" in data
        assert "created_at" in data

    def test_list_exams(self, client: TestClient, session: Session, sample_user: User):
        """Test listar exámenes"""
        # Crear algunos exámenes
        exam1 = Exam(title="Exam 1", subject="Math", creator_id=sample_user.id)
        exam2 = Exam(title="Exam 2", subject="Science", creator_id=sample_user.id)
        session.add_all([exam1, exam2])
        session.commit()

        response = client.get("/api/v1/exams/")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert any(exam["title"] == "Exam 1" for exam in data)
        assert any(exam["title"] == "Exam 2" for exam in data)

    def test_get_exam(self, client: TestClient, session: Session, sample_user: User):
        """Test obtener examen específico"""
        exam = Exam(title="Test Exam", subject="Math", creator_id=sample_user.id)
        session.add(exam)
        session.commit()
        session.refresh(exam)

        response = client.get(f"/api/v1/exams/{exam.id}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == exam.id
        assert data["title"] == "Test Exam"
        assert data["subject"] == "Math"

    def test_get_exam_not_found(self, client: TestClient):
        """Test obtener examen inexistente"""
        response = client.get("/api/v1/exams/999")
        
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()

    def test_update_exam(self, client: TestClient, session: Session, sample_user: User):
        """Test actualizar examen"""
        exam = Exam(title="Original Title", subject="Math", creator_id=sample_user.id)
        session.add(exam)
        session.commit()
        session.refresh(exam)

        update_data = {
            "title": "Updated Title",
            "description": "Updated description",
            "passing_score": 80.0
        }
        response = client.put(f"/api/v1/exams/{exam.id}", json=update_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Updated Title"
        assert data["description"] == "Updated description"
        assert data["passing_score"] == 80.0
        assert data["subject"] == "Math"  # No cambiado

    def test_update_exam_not_found(self, client: TestClient):
        """Test actualizar examen inexistente"""
        update_data = {"title": "New Title"}
        response = client.put("/api/v1/exams/999", json=update_data)
        
        assert response.status_code == 404

    def test_delete_exam(self, client: TestClient, session: Session, sample_user: User):
        """Test eliminar examen"""
        exam = Exam(title="To Delete", subject="Math", creator_id=sample_user.id)
        session.add(exam)
        session.commit()
        session.refresh(exam)

        response = client.delete(f"/api/v1/exams/{exam.id}")
        
        assert response.status_code == 204
        
        # Verificar que fue eliminado
        deleted_exam = session.get(Exam, exam.id)
        assert deleted_exam is None

    def test_delete_exam_not_found(self, client: TestClient):
        """Test eliminar examen inexistente"""
        response = client.delete("/api/v1/exams/999")
        
        assert response.status_code == 404


class TestExamBusinessLogic:
    """Tests para lógica de negocio de exámenes usando Services"""

    def test_validate_exam_without_questions(self, client: TestClient, session: Session, sample_user: User):
        """Test validar examen sin preguntas"""
        exam = Exam(title="Empty Exam", subject="Math", creator_id=sample_user.id)
        session.add(exam)
        session.commit()
        session.refresh(exam)

        response = client.get(f"/api/v1/exams/{exam.id}/validate")
        
        assert response.status_code == 200
        data = response.json()
        assert data["can_publish"] is False
        assert "question" in data["message"].lower()

    def test_validate_exam_with_questions(self, client: TestClient, session: Session, sample_user: User):
        """Test validar examen con preguntas"""
        exam = Exam(title="Complete Exam", subject="Math", creator_id=sample_user.id)
        session.add(exam)
        session.commit()
        session.refresh(exam)

        # Agregar pregunta
        question = Question(
            exam_id=exam.id,
            text="What is 2+2?",
            question_type="multiple_choice",
            points=1.0
        )
        session.add(question)
        session.commit()

        response = client.get(f"/api/v1/exams/{exam.id}/validate")
        
        assert response.status_code == 200
        data = response.json()
        assert data["can_publish"] is True
        assert "ready" in data["message"].lower()

    def test_publish_exam_success(self, client: TestClient, session: Session, sample_user: User):
        """Test publicar examen exitosamente"""
        exam = Exam(title="Ready Exam", subject="Math", creator_id=sample_user.id)
        session.add(exam)
        session.commit()
        session.refresh(exam)

        # Agregar pregunta
        question = Question(
            exam_id=exam.id,
            text="What is 2+2?",
            question_type="multiple_choice",
            points=1.0
        )
        session.add(question)
        session.commit()

        response = client.post(f"/api/v1/exams/{exam.id}/publish")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "published"

    def test_publish_exam_without_questions_fails(self, client: TestClient, session: Session, sample_user: User):
        """Test publicar examen sin preguntas falla"""
        exam = Exam(title="Empty Exam", subject="Math", creator_id=sample_user.id)
        session.add(exam)
        session.commit()
        session.refresh(exam)

        response = client.post(f"/api/v1/exams/{exam.id}/publish")
        
        assert response.status_code == 400
        assert "cannot be published" in response.json()["detail"].lower()

    def test_archive_exam(self, client: TestClient, session: Session, sample_user: User):
        """Test archivar examen"""
        exam = Exam(title="To Archive", subject="Math", creator_id=sample_user.id, status=ExamStatus.PUBLISHED)
        session.add(exam)
        session.commit()
        session.refresh(exam)

        response = client.post(f"/api/v1/exams/{exam.id}/archive")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "archived"

    def test_get_exam_statistics(self, client: TestClient, session: Session, sample_user: User):
        """Test obtener estadísticas de examen"""
        exam = Exam(title="Stats Exam", subject="Math", creator_id=sample_user.id)
        session.add(exam)
        session.commit()
        session.refresh(exam)

        # Agregar algunas preguntas
        question1 = Question(exam_id=exam.id, text="Q1", question_type="multiple_choice", points=1.0)
        question2 = Question(exam_id=exam.id, text="Q2", question_type="multiple_choice", points=2.0)
        session.add_all([question1, question2])
        session.commit()

        response = client.get(f"/api/v1/exams/{exam.id}/statistics")
        
        assert response.status_code == 200
        data = response.json()
        assert data["exam_id"] == exam.id
        assert data["title"] == "Stats Exam"
        assert data["questions_count"] == 2
        assert "sessions_completed" in data
        assert "average_score" in data


class TestExamService:
    """Tests para ExamService - lógica de negocio de exámenes"""
    
    def test_validate_exam_for_publication_no_questions(self, session: Session, sample_user: User):
        """Test validación de examen sin preguntas"""
        # Crear examen sin preguntas
        exam = Exam(
            title="Test Exam",
            subject="Mathematics",
            creator_id=sample_user.id
        )
        session.add(exam)
        session.commit()
        session.refresh(exam)
        
        # Validar que no se puede publicar
        can_publish = ExamService.validate_exam_for_publication(exam.id, session)
        assert can_publish is False
    
    def test_validate_exam_for_publication_with_questions(self, session: Session, sample_user: User):
        """Test validación de examen con preguntas"""
        # Crear examen
        exam = Exam(
            title="Test Exam",
            subject="Mathematics", 
            creator_id=sample_user.id
        )
        session.add(exam)
        session.commit()
        session.refresh(exam)
        
        # Agregar pregunta
        question = Question(
            exam_id=exam.id,
            text="What is 2+2?",
            question_type="multiple_choice",
            points=1.0
        )
        session.add(question)
        session.commit()
        
        # Validar que sí se puede publicar
        can_publish = ExamService.validate_exam_for_publication(exam.id, session)
        assert can_publish is True
    
    def test_publish_exam_success(self, session: Session, sample_user: User):
        """Test publicación exitosa de examen"""
        # Crear examen con pregunta
        exam = Exam(
            title="Test Exam",
            subject="Mathematics",
            creator_id=sample_user.id
        )
        session.add(exam)
        session.commit()
        session.refresh(exam)
        
        question = Question(
            exam_id=exam.id,
            text="What is 2+2?",
            question_type="multiple_choice",
            points=1.0
        )
        session.add(question)
        session.commit()
        
        # Publicar examen
        published_exam = ExamService.publish_exam(exam.id, session)
        
        assert published_exam.status == ExamStatus.PUBLISHED
        assert published_exam.id == exam.id
    
    def test_publish_exam_without_questions_fails(self, session: Session, sample_user: User):
        """Test que publicar examen sin preguntas falla"""
        # Crear examen sin preguntas
        exam = Exam(
            title="Test Exam",
            subject="Mathematics",
            creator_id=sample_user.id
        )
        session.add(exam)
        session.commit()
        session.refresh(exam)
        
        # Intentar publicar debe fallar
        with pytest.raises(Exception) as exc_info:
            ExamService.publish_exam(exam.id, session)
        
        assert "cannot be published" in str(exc_info.value).lower()
    
    def test_get_exam_statistics_service(self, session: Session, sample_user: User):
        """Test obtener estadísticas usando servicio directamente"""
        exam = Exam(title="Stats Exam", subject="Math", creator_id=sample_user.id)
        session.add(exam)
        session.commit()
        session.refresh(exam)

        # Agregar algunas preguntas
        question1 = Question(exam_id=exam.id, text="Q1", question_type="multiple_choice", points=1.0)
        question2 = Question(exam_id=exam.id, text="Q2", question_type="multiple_choice", points=2.0)
        session.add_all([question1, question2])
        session.commit()

        # Obtener estadísticas usando servicio
        stats = ExamService.get_exam_statistics(exam.id, session)
        
        assert stats["exam_id"] == exam.id
        assert stats["title"] == "Stats Exam"
        assert stats["questions_count"] == 2
        assert stats["status"] == ExamStatus.DRAFT
