import pytest
from app.core.config import Settings
from app.core.security import (
    create_access_token, 
    verify_password, 
    get_password_hash, 
    verify_token
)


class TestSettings:
    """Tests for application settings"""
    
    def test_default_settings(self):
        """Test default settings values"""
        settings = Settings()
        
        # APP_NAME viene del .env file
        assert settings.APP_NAME == "exam-scan"
        assert settings.APP_VERSION == "1.0.0"
        assert settings.DEBUG is True  # True desde .env
        assert settings.ENV == "development"
        assert settings.HOST == "0.0.0.0"
        assert settings.PORT == 8000
        assert settings.ALGORITHM == "HS256"
        assert settings.ACCESS_TOKEN_EXPIRE_MINUTES == 30
        assert isinstance(settings.ALLOWED_ORIGINS, list)
    
    def test_database_url_format(self):
        """Test database URL format"""
        settings = Settings()
        assert settings.DATABASE_URL.startswith("postgresql+psycopg2://")
        assert "localhost:5432" in settings.DATABASE_URL or "db:5432" in settings.DATABASE_URL
    
    def test_env_override(self, monkeypatch):
        """Test environment variable override"""
        monkeypatch.setenv("APP_NAME", "Test App")
        monkeypatch.setenv("DEBUG", "false")
        monkeypatch.setenv("PORT", "9000")
        
        settings = Settings()
        
        assert settings.APP_NAME == "Test App"
        assert settings.DEBUG is False
        assert settings.PORT == 9000


class TestSecurity:
    """Tests for security functions"""
    
    def test_password_hashing(self):
        """Test password hashing and verification"""
        password = "testpassword123"
        
        # Test hashing
        hashed = get_password_hash(password)
        assert hashed != password
        assert len(hashed) > 50  # Bcrypt hashes are long
        
        # Test verification
        assert verify_password(password, hashed) is True
        assert verify_password("wrongpassword", hashed) is False
    
    def test_password_hash_uniqueness(self):
        """Test that same password generates different hashes"""
        password = "testpassword123"
        
        hash1 = get_password_hash(password)
        hash2 = get_password_hash(password)
        
        # Should be different due to salt
        assert hash1 != hash2
        
        # But both should verify correctly
        assert verify_password(password, hash1) is True
        assert verify_password(password, hash2) is True
    
    def test_jwt_token_creation(self):
        """Test JWT token creation"""
        subject = "123"
        token = create_access_token(subject=subject)
        
        assert isinstance(token, str)
        assert len(token) > 50  # JWT tokens are long
        assert "." in token  # JWT format has dots
    
    def test_jwt_token_verification(self):
        """Test JWT token verification"""
        subject = "user123"
        token = create_access_token(subject=subject)
        
        # Test valid token
        verified_subject = verify_token(token)
        assert verified_subject == subject
        
        # Test invalid token
        invalid_token = "invalid.token.here"
        assert verify_token(invalid_token) is None
    
    def test_jwt_token_expiration(self):
        """Test JWT token with custom expiration"""
        from datetime import timedelta
        
        subject = "user123"
        # Create token with very short expiration for testing
        token = create_access_token(
            subject=subject, 
            expires_delta=timedelta(seconds=1)
        )
        
        # Should be valid immediately
        assert verify_token(token) == subject
        
        # Note: Testing actual expiration would require time manipulation
        # or waiting, which is not practical in unit tests
    
    def test_empty_token_verification(self):
        """Test verification of empty token"""
        assert verify_token("") is None
    
    def test_malformed_token_verification(self):
        """Test verification of malformed tokens"""
        malformed_tokens = [
            "not.a.jwt",
            "too.few.parts",
            "way.too.many.parts.here.invalid",
            "invalid-characters-###",
            "   ",  # whitespace
        ]
        
        for token in malformed_tokens:
            assert verify_token(token) is None
