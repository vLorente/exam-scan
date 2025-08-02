import pytest
from datetime import datetime
from sqlmodel import Session
from app.models.user import User, UserCreate, UserRole
from app.models.exam import Exam, ExamStatus, ExamType
from app.models.question import Question, QuestionType
from app.models.tag import Tag


class TestUserModel:
    """Tests for User model"""
    
    def test_user_creation(self, session: Session):
        """Test basic user creation"""
        user = User(
            email="test@example.com",
            username="testuser",
            full_name="Test User",
            hashed_password="hashed_password_123",
            role=UserRole.STUDENT
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        
        assert user.id is not None
        assert user.email == "test@example.com"
        assert user.role == UserRole.STUDENT
        assert user.is_active is True
        assert user.created_at is not None
        assert isinstance(user.created_at, datetime)
    
    def test_user_unique_constraints(self, session: Session):
        """Test unique constraints on email and username"""
        user1 = User(
            email="test@example.com",
            username="testuser",
            full_name="Test User 1",
            hashed_password="hashed_password_123"
        )
        session.add(user1)
        session.commit()
        
        # Try to create user with same email
        user2 = User(
            email="test@example.com",  # Same email
            username="testuser2",
            full_name="Test User 2",
            hashed_password="hashed_password_456"
        )
        session.add(user2)
        
        with pytest.raises(Exception):  # Should raise integrity error
            session.commit()
    
    def test_user_roles(self, session: Session):
        """Test different user roles"""
        admin = User(
            email="admin@example.com",
            username="admin",
            full_name="Admin User",
            hashed_password="hashed_password_123",
            role=UserRole.ADMIN
        )
        
        teacher = User(
            email="teacher@example.com", 
            username="teacher",
            full_name="Teacher User",
            hashed_password="hashed_password_123",
            role=UserRole.TEACHER
        )
        
        session.add_all([admin, teacher])
        session.commit()
        
        assert admin.role == UserRole.ADMIN
        assert teacher.role == UserRole.TEACHER


class TestExamModel:
    """Tests for Exam model"""
    
    def test_exam_creation(self, session: Session):
        """Test basic exam creation"""
        # Create user first (required for creator_id)
        user = User(
            email="creator@example.com",
            username="creator",
            full_name="Creator User",
            hashed_password="hashed_password_123",
            role=UserRole.TEACHER
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        
        exam = Exam(
            title="Test Exam",
            description="Test Description",
            subject="Mathematics",
            creator_id=user.id,
            duration_minutes=60,
            max_attempts=3,
            passing_score=70.0,
            status=ExamStatus.DRAFT,
            exam_type=ExamType.MULTIPLE_CHOICE
        )
        session.add(exam)
        session.commit()
        session.refresh(exam)
        
        assert exam.id is not None
        assert exam.title == "Test Exam"
        assert exam.status == ExamStatus.DRAFT
        assert exam.exam_type == ExamType.MULTIPLE_CHOICE
        assert exam.duration_minutes == 60
        assert exam.passing_score == 70.0
        assert exam.created_at is not None
    
    def test_exam_status_enum(self, session: Session):
        """Test exam status enum values"""
        user = User(
            email="creator@example.com",
            username="creator",
            full_name="Creator User",
            hashed_password="hashed_password_123",
            role=UserRole.TEACHER
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        
        exam = Exam(
            title="Status Test Exam",
            subject="Test",
            creator_id=user.id,
            status=ExamStatus.PUBLISHED
        )
        session.add(exam)
        session.commit()
        
        assert exam.status == ExamStatus.PUBLISHED
        assert exam.status.value == "published"
    
    def test_exam_validation_constraints(self, session: Session):
        """Test exam field validation constraints"""
        user = User(
            email="creator@example.com",
            username="creator", 
            full_name="Creator User",
            hashed_password="hashed_password_123",
            role=UserRole.TEACHER
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        
        # Test valid exam
        exam = Exam(
            title="Valid Exam",
            subject="Test",
            creator_id=user.id,
            duration_minutes=120,  # Valid: between 1-480
            max_attempts=5,        # Valid: between 1-10
            passing_score=85.5     # Valid: between 0-100
        )
        session.add(exam)
        session.commit()
        
        assert exam.duration_minutes == 120
        assert exam.max_attempts == 5
        assert exam.passing_score == 85.5


class TestQuestionModel:
    """Tests for Question model"""
    
    def test_question_creation(self, session: Session):
        """Test basic question creation"""
        # Create user and exam first
        user = User(
            email="creator@example.com",
            username="creator",
            full_name="Creator User", 
            hashed_password="hashed_password_123",
            role=UserRole.TEACHER
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        
        exam = Exam(
            title="Test Exam",
            subject="Test",
            creator_id=user.id
        )
        session.add(exam)
        session.commit()
        session.refresh(exam)
        
        question = Question(
            text="What is 2 + 2?",
            question_type=QuestionType.MULTIPLE_CHOICE,
            points=10.0,
            exam_id=exam.id,
            order_in_exam=1
        )
        session.add(question)
        session.commit()
        session.refresh(question)
        
        assert question.id is not None
        assert question.text == "What is 2 + 2?"
        assert question.question_type == QuestionType.MULTIPLE_CHOICE
        assert question.points == 10.0
        assert question.exam_id == exam.id


class TestTagModel:
    """Tests for Tag model"""
    
    def test_tag_creation(self, session: Session):
        """Test basic tag creation"""
        tag = Tag(
            name="Mathematics",
            description="Math related questions",
            color="#FF5733"
        )
        session.add(tag)
        session.commit()
        session.refresh(tag)
        
        assert tag.id is not None
        assert tag.name == "Mathematics"
        assert tag.description == "Math related questions"
        assert tag.color == "#FF5733"
        assert tag.created_at is not None
    
    def test_tag_unique_name(self, session: Session):
        """Test unique constraint on tag name"""
        tag1 = Tag(name="Mathematics", description="First tag")
        session.add(tag1)
        session.commit()
        
        tag2 = Tag(name="Mathematics", description="Second tag")  # Same name
        session.add(tag2)
        
        with pytest.raises(Exception):  # Should raise integrity error
            session.commit()


class TestModelRelationships:
    """Tests for model relationships"""
    
    def test_user_exam_relationship(self, session: Session):
        """Test relationship between User and Exam"""
        user = User(
            email="creator@example.com",
            username="creator",
            full_name="Creator User",
            hashed_password="hashed_password_123",
            role=UserRole.TEACHER
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        
        exam1 = Exam(title="Exam 1", subject="Math", creator_id=user.id)
        exam2 = Exam(title="Exam 2", subject="Science", creator_id=user.id)
        
        session.add_all([exam1, exam2])
        session.commit()
        
        # Test relationship
        session.refresh(user)
        assert len(user.created_exams) == 2
        assert exam1 in user.created_exams
        assert exam2 in user.created_exams
    
    def test_exam_question_relationship(self, session: Session):
        """Test relationship between Exam and Question"""
        user = User(
            email="creator@example.com",
            username="creator",
            full_name="Creator User",
            hashed_password="hashed_password_123",
            role=UserRole.TEACHER
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        
        exam = Exam(title="Test Exam", subject="Test", creator_id=user.id)
        session.add(exam)
        session.commit()
        session.refresh(exam)
        
        question1 = Question(
            text="Question 1",
            question_type=QuestionType.MULTIPLE_CHOICE,
            exam_id=exam.id,
            order_in_exam=1
        )
        question2 = Question(
            text="Question 2", 
            question_type=QuestionType.TRUE_FALSE,
            exam_id=exam.id,
            order_in_exam=2
        )
        
        session.add_all([question1, question2])
        session.commit()
        
        # Test relationship
        session.refresh(exam)
        assert len(exam.questions) == 2
        assert question1 in exam.questions
        assert question2 in exam.questions
