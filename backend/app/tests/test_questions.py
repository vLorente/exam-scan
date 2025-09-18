"""
Tests para preguntas y opciones - CRUD y servicios
"""

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, select
from app.models.user import User
from app.models.exam import Exam
from app.models.question import Question, QuestionType, Option
from app.services import QuestionService


@pytest.fixture(name="sample_exam")
def sample_exam_fixture(session: Session, sample_user: User):
    """Crear un examen de prueba"""
    exam = Exam(
        title="Test Exam",
        subject="Mathematics",
        creator_id=sample_user.id
    )
    session.add(exam)
    session.commit()
    session.refresh(exam)
    return exam


@pytest.fixture(name="sample_question_data")
def sample_question_data_fixture():
    """Datos de pregunta de prueba"""
    return {
        "text": "What is 2+2?",
        "question_type": "multiple_choice",
        "points": 1.0,
        "difficulty": "medium",
        "explanation": "Basic arithmetic question"
    }


class TestQuestionsCRUD:
    """Tests para operaciones CRUD de preguntas"""
    
    def test_create_question(self, client: TestClient, sample_exam: Exam, sample_question_data: dict):
        """Test crear pregunta"""
        response = client.post(f"/api/v1/questions/?exam_id={sample_exam.id}", json=sample_question_data)
        
        assert response.status_code == 201
        data = response.json()
        assert data["text"] == sample_question_data["text"]
        assert data["question_type"] == sample_question_data["question_type"]
        assert data["exam_id"] == sample_exam.id
        assert "id" in data
    
    def test_list_questions(self, client: TestClient, session: Session, sample_exam: Exam):
        """Test listar preguntas"""
        # Crear algunas preguntas
        question1 = Question(exam_id=sample_exam.id, text="Question 1", question_type="multiple_choice", points=1.0)
        question2 = Question(exam_id=sample_exam.id, text="Question 2", question_type="true_false", points=2.0)
        session.add_all([question1, question2])
        session.commit()

        response = client.get(f"/api/v1/questions/?exam_id={sample_exam.id}")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert any(q["text"] == "Question 1" for q in data)
        assert any(q["text"] == "Question 2" for q in data)
    
    def test_get_question_with_options(self, client: TestClient, session: Session, sample_exam: Exam):
        """Test obtener pregunta específica con opciones"""
        question = Question(exam_id=sample_exam.id, text="Test Question", question_type="multiple_choice", points=1.0)
        session.add(question)
        session.commit()
        session.refresh(question)
        
        # Agregar opciones
        option1 = Option(question_id=question.id, text="Option 1", is_correct=True, order_index=0)
        option2 = Option(question_id=question.id, text="Option 2", is_correct=False, order_index=1)
        session.add_all([option1, option2])
        session.commit()

        response = client.get(f"/api/v1/questions/{question.id}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["text"] == "Test Question"
        assert len(data["options"]) == 2
        assert any(opt["text"] == "Option 1" and opt["is_correct"] for opt in data["options"])
    
    def test_update_question(self, client: TestClient, session: Session, sample_exam: Exam):
        """Test actualizar pregunta"""
        question = Question(exam_id=sample_exam.id, text="Original Text", question_type="multiple_choice", points=1.0)
        session.add(question)
        session.commit()
        session.refresh(question)

        update_data = {
            "text": "Updated Text",
            "points": 2.0,
            "difficulty": "hard"
        }
        response = client.put(f"/api/v1/questions/{question.id}", json=update_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data["text"] == "Updated Text"
        assert data["points"] == 2.0
        assert data["difficulty"] == "hard"
    
    def test_delete_question(self, client: TestClient, session: Session, sample_exam: Exam):
        """Test eliminar pregunta"""
        question = Question(exam_id=sample_exam.id, text="To Delete", question_type="multiple_choice", points=1.0)
        session.add(question)
        session.commit()
        session.refresh(question)

        response = client.delete(f"/api/v1/questions/{question.id}")
        
        assert response.status_code == 204
        
        # Verificar que fue eliminada
        deleted_question = session.get(Question, question.id)
        assert deleted_question is None


class TestOptionsCRUD:
    """Tests para operaciones CRUD de opciones"""
    
    def test_create_option(self, client: TestClient, session: Session, sample_exam: Exam):
        """Test crear opción"""
        question = Question(exam_id=sample_exam.id, text="Test Question", question_type="multiple_choice", points=1.0)
        session.add(question)
        session.commit()
        session.refresh(question)
        
        option_data = {
            "text": "Test Option",
            "is_correct": True,
            "order_index": 0
        }
        response = client.post(f"/api/v1/questions/{question.id}/options", json=option_data)
        
        assert response.status_code == 201
        data = response.json()
        assert data["text"] == "Test Option"
        assert data["is_correct"] is True
        assert data["question_id"] == question.id
    
    def test_list_question_options(self, client: TestClient, session: Session, sample_exam: Exam):
        """Test listar opciones de una pregunta"""
        question = Question(exam_id=sample_exam.id, text="Test Question", question_type="multiple_choice", points=1.0)
        session.add(question)
        session.commit()
        session.refresh(question)
        
        # Agregar opciones
        option1 = Option(question_id=question.id, text="Option 1", is_correct=True, order_index=0)
        option2 = Option(question_id=question.id, text="Option 2", is_correct=False, order_index=1)
        session.add_all([option1, option2])
        session.commit()

        response = client.get(f"/api/v1/questions/{question.id}/options")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        # Verificar que están ordenadas por order_index
        assert data[0]["text"] == "Option 1"
        assert data[1]["text"] == "Option 2"
    
    def test_update_option(self, client: TestClient, session: Session, sample_exam: Exam):
        """Test actualizar opción"""
        question = Question(exam_id=sample_exam.id, text="Test Question", question_type="multiple_choice", points=1.0)
        session.add(question)
        session.commit()
        session.refresh(question)
        
        option = Option(question_id=question.id, text="Original Text", is_correct=False, order_index=0)
        session.add(option)
        session.commit()
        session.refresh(option)

        update_data = {
            "text": "Updated Text",
            "is_correct": True
        }
        response = client.put(f"/api/v1/questions/options/{option.id}", json=update_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data["text"] == "Updated Text"
        assert data["is_correct"] is True
    
    def test_delete_option(self, client: TestClient, session: Session, sample_exam: Exam):
        """Test eliminar opción"""
        question = Question(exam_id=sample_exam.id, text="Test Question", question_type="multiple_choice", points=1.0)
        session.add(question)
        session.commit()
        session.refresh(question)
        
        option = Option(question_id=question.id, text="To Delete", is_correct=False, order_index=0)
        session.add(option)
        session.commit()
        session.refresh(option)

        response = client.delete(f"/api/v1/questions/options/{option.id}")
        
        assert response.status_code == 204
        
        # Verificar que fue eliminada
        deleted_option = session.get(Option, option.id)
        assert deleted_option is None


class TestQuestionBusinessLogic:
    """Tests para lógica de negocio de preguntas"""
    
    def test_validate_question_multiple_choice_valid(self, client: TestClient, session: Session, sample_exam: Exam):
        """Test validar pregunta de opción múltiple válida"""
        question = Question(exam_id=sample_exam.id, text="Test Question", question_type="multiple_choice", points=1.0)
        session.add(question)
        session.commit()
        session.refresh(question)
        
        # Agregar opciones válidas
        option1 = Option(question_id=question.id, text="Correct", is_correct=True, order_index=0)
        option2 = Option(question_id=question.id, text="Wrong 1", is_correct=False, order_index=1)
        option3 = Option(question_id=question.id, text="Wrong 2", is_correct=False, order_index=2)
        session.add_all([option1, option2, option3])
        session.commit()

        response = client.post(f"/api/v1/questions/{question.id}/validate")
        
        assert response.status_code == 200
        data = response.json()
        assert data["is_valid"] is True
        assert len(data["errors"]) == 0
        assert data["options_count"] == 3
        assert data["correct_options_count"] == 1
    
    def test_validate_question_multiple_choice_invalid(self, client: TestClient, session: Session, sample_exam: Exam):
        """Test validar pregunta de opción múltiple inválida"""
        question = Question(exam_id=sample_exam.id, text="Test Question", question_type="multiple_choice", points=1.0)
        session.add(question)
        session.commit()
        session.refresh(question)
        
        # Solo una opción (inválido)
        option1 = Option(question_id=question.id, text="Only Option", is_correct=False, order_index=0)
        session.add(option1)
        session.commit()

        response = client.post(f"/api/v1/questions/{question.id}/validate")
        
        assert response.status_code == 200
        data = response.json()
        assert data["is_valid"] is False
        assert "at least 2 options" in str(data["errors"])
        assert "at least 1 correct option" in str(data["errors"])
    
    def test_validate_all_exam_questions(self, client: TestClient, session: Session, sample_exam: Exam):
        """Test validar todas las preguntas de un examen"""
        # Crear pregunta válida
        question1 = Question(exam_id=sample_exam.id, text="Valid Question", question_type="multiple_choice", points=1.0)
        session.add(question1)
        session.commit()
        session.refresh(question1)
        
        option1 = Option(question_id=question1.id, text="Correct", is_correct=True, order_index=0)
        option2 = Option(question_id=question1.id, text="Wrong", is_correct=False, order_index=1)
        session.add_all([option1, option2])
        
        # Crear pregunta inválida
        question2 = Question(exam_id=sample_exam.id, text="Invalid Question", question_type="multiple_choice", points=1.0)
        session.add(question2)
        session.commit()
        session.refresh(question2)
        
        # Sin opciones (inválida)
        session.commit()

        response = client.get(f"/api/v1/questions/exam/{sample_exam.id}/validate-all")
        
        assert response.status_code == 200
        data = response.json()
        assert data["total_questions"] == 2
        assert data["valid_questions"] == 1
        assert data["invalid_questions"] == 1
        assert data["is_valid"] is False


class TestQuestionService:
    """Tests para QuestionService - lógica de negocio de preguntas"""
    
    def test_validate_multiple_choice_question(self, session: Session, sample_exam: Exam):
        """Test validación de pregunta multiple choice con servicio"""
        question = Question(exam_id=sample_exam.id, text="Test Question", question_type=QuestionType.MULTIPLE_CHOICE, points=1.0)
        session.add(question)
        session.commit()
        session.refresh(question)
        
        # Agregar opciones válidas
        option1 = Option(question_id=question.id, text="Correct", is_correct=True, order_index=0)
        option2 = Option(question_id=question.id, text="Wrong", is_correct=False, order_index=1)
        session.add_all([option1, option2])
        session.commit()
        
        # Validar usando servicio
        result = QuestionService.validate_question_structure(question.id, session)
        
        assert result["is_valid"] is True
        assert len(result["errors"]) == 0
        assert result["question_type"] == QuestionType.MULTIPLE_CHOICE
        assert result["options_count"] == 2
        assert result["correct_options_count"] == 1
    
    def test_validate_true_false_question(self, session: Session, sample_exam: Exam):
        """Test validación de pregunta verdadero/falso"""
        question = Question(exam_id=sample_exam.id, text="Test Question", question_type=QuestionType.TRUE_FALSE, points=1.0)
        session.add(question)
        session.commit()
        session.refresh(question)
        
        # Agregar opciones correctas para True/False
        option1 = Option(question_id=question.id, text="True", is_correct=True, order_index=0)
        option2 = Option(question_id=question.id, text="False", is_correct=False, order_index=1)
        session.add_all([option1, option2])
        session.commit()
        
        # Validar usando servicio
        result = QuestionService.validate_question_structure(question.id, session)
        
        assert result["is_valid"] is True
        assert len(result["errors"]) == 0
        assert result["options_count"] == 2
        assert result["correct_options_count"] == 1
    
    def test_auto_fix_question(self, session: Session, sample_exam: Exam):
        """Test auto-corrección de pregunta"""
        question = Question(exam_id=sample_exam.id, text="Test Question", question_type=QuestionType.TRUE_FALSE, points=1.0)
        session.add(question)
        session.commit()
        session.refresh(question)
        
        # Sin opciones inicialmente
        result = QuestionService.auto_fix_question(question.id, session)
        
        assert result["fixes_count"] > 0
        assert "True/False options" in str(result["fixes_applied"])
        
        # Verificar que se crearon las opciones
        options = session.exec(
            select(Option).where(Option.question_id == question.id)
        ).all()
        assert len(options) == 2
    
    def test_bulk_validate_exam_questions(self, session: Session, sample_exam: Exam):
        """Test validación en lote de preguntas de examen"""
        # Crear pregunta válida
        question1 = Question(exam_id=sample_exam.id, text="Valid Question", question_type=QuestionType.MULTIPLE_CHOICE, points=1.0)
        session.add(question1)
        session.commit()
        session.refresh(question1)
        
        option1 = Option(question_id=question1.id, text="Correct", is_correct=True, order_index=0)
        option2 = Option(question_id=question1.id, text="Wrong", is_correct=False, order_index=1)
        session.add_all([option1, option2])
        
        # Crear pregunta inválida
        question2 = Question(exam_id=sample_exam.id, text="Invalid Question", question_type=QuestionType.MULTIPLE_CHOICE, points=1.0)
        session.add(question2)
        session.commit()
        
        # Validar usando servicio
        if sample_exam.id is not None:
            result = QuestionService.bulk_validate_exam_questions(sample_exam.id, session)
            
            assert result["total_questions"] == 2
            assert result["valid_questions"] == 1
            assert result["invalid_questions"] == 1
            assert result["is_valid"] is False
            assert len(result["question_validations"]) == 2
