import pytest
from sqlmodel import SQLModel, Session
from app.core.database import create_db_and_tables, get_session, engine
from app.api.deps import get_current_user_id, get_current_user
from app.models.user import User
from fastapi.security import HTTPAuthorizationCredentials
from fastapi import HTTPException


class TestDatabase:
    """Tests for database functionality"""
    
    def test_database_engine_creation(self):
        """Test that database engine is created"""
        assert engine is not None
        assert hasattr(engine, 'connect')
    
    def test_get_session_dependency(self):
        """Test get_session dependency function"""
        session_generator = get_session()
        session = next(session_generator)
        
        assert isinstance(session, Session)
        
        # Clean up
        try:
            next(session_generator)
        except StopIteration:
            pass  # Expected when generator is exhausted
    
    def test_create_db_and_tables(self):
        """Test create_db_and_tables function"""
        # This should not raise an exception
        try:
            create_db_and_tables()
        except Exception as e:
            pytest.fail(f"create_db_and_tables raised an exception: {e}")
    
    def test_metadata_contains_models(self):
        """Test that SQLModel metadata contains our models"""
        table_names = set(SQLModel.metadata.tables.keys())
        
        expected_tables = {
            'user', 'exam', 'question', 'option', 
            'examsession', 'studentanswer', 'tag'
        }
        
        # Check that all expected tables are in metadata
        for table in expected_tables:
            assert table in table_names, f"Table {table} not found in metadata"


class TestDependencies:
    """Tests for API dependencies"""
    
    def test_get_current_user_id_valid_token(self, session: Session):
        """Test get_current_user_id with valid token"""
        from app.core.security import create_access_token
        
        # Create a test user
        user = User(
            email="test@example.com",
            username="testuser",
            full_name="Test User",
            hashed_password="hashed_password_123"
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        
        # Create token
        token = create_access_token(subject=str(user.id))
        credentials = HTTPAuthorizationCredentials(
            scheme="Bearer",
            credentials=token
        )
        
        # Test function
        user_id = get_current_user_id(credentials)
        assert user_id == str(user.id)
    
    def test_get_current_user_id_invalid_token(self):
        """Test get_current_user_id with invalid token"""
        credentials = HTTPAuthorizationCredentials(
            scheme="Bearer",
            credentials="invalid_token"
        )
        
        with pytest.raises(HTTPException) as exc_info:
            get_current_user_id(credentials)
        
        assert exc_info.value.status_code == 401
    
    def test_get_current_user_valid_user(self, session: Session):
        """Test get_current_user with valid user ID"""
        # Create a test user
        user = User(
            email="test@example.com",
            username="testuser",
            full_name="Test User",
            hashed_password="hashed_password_123",
            is_active=True
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        
        # Test function
        retrieved_user = get_current_user(session, str(user.id))
        
        assert retrieved_user.id == user.id
        assert retrieved_user.email == user.email
        assert retrieved_user.is_active is True
    
    def test_get_current_user_nonexistent_user(self, session: Session):
        """Test get_current_user with nonexistent user ID"""
        with pytest.raises(HTTPException) as exc_info:
            get_current_user(session, "99999")
        
        assert exc_info.value.status_code == 401
        assert "User not found" in str(exc_info.value.detail)
    
    def test_get_current_user_inactive_user(self, session: Session):
        """Test get_current_user with inactive user"""
        # Create an inactive user
        user = User(
            email="inactive@example.com",
            username="inactiveuser",
            full_name="Inactive User",
            hashed_password="hashed_password_123",
            is_active=False
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        
        with pytest.raises(HTTPException) as exc_info:
            get_current_user(session, str(user.id))
        
        assert exc_info.value.status_code == 401
        assert "Inactive user" in str(exc_info.value.detail)
