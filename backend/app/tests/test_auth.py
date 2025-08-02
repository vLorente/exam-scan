import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, select

from app.models.user import User


def test_register_user(client: TestClient, test_user_data: dict):
    """Test user registration"""
    response = client.post("/api/v1/auth/register", json=test_user_data)
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["email"] == test_user_data["email"]
    assert data["username"] == test_user_data["username"]
    assert data["full_name"] == test_user_data["full_name"]
    assert data["role"] == "student"  # default role
    assert data["is_active"] is True
    assert "id" in data
    assert "password" not in data  # password should not be returned


def test_register_duplicate_email(client: TestClient, session: Session, test_user_data: dict):
    """Test registration with duplicate email"""
    # First registration
    response1 = client.post("/api/v1/auth/register", json=test_user_data)
    assert response1.status_code == 200
    
    # Second registration with same email
    response2 = client.post("/api/v1/auth/register", json=test_user_data)
    assert response2.status_code == 400
    assert "Email ya registrado" in response2.json()["detail"]


def test_login_success(client: TestClient, test_user_data: dict):
    """Test successful login"""
    # Register user first
    client.post("/api/v1/auth/register", json=test_user_data)
    
    # Login
    login_data = {
        "email": test_user_data["email"],
        "password": test_user_data["password"]
    }
    response = client.post("/api/v1/auth/login", json=login_data)
    
    assert response.status_code == 200
    data = response.json()
    
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert len(data["access_token"]) > 0


def test_login_invalid_credentials(client: TestClient, test_user_data: dict):
    """Test login with invalid credentials"""
    # Register user first
    client.post("/api/v1/auth/register", json=test_user_data)
    
    # Try login with wrong password
    login_data = {
        "email": test_user_data["email"],
        "password": "wrongpassword"
    }
    response = client.post("/api/v1/auth/login", json=login_data)
    
    assert response.status_code == 401
    assert "Credenciales inválidas" in response.json()["detail"]


def test_login_nonexistent_user(client: TestClient):
    """Test login with non-existent user"""
    login_data = {
        "email": "nonexistent@example.com",
        "password": "somepassword"
    }
    response = client.post("/api/v1/auth/login", json=login_data)
    
    assert response.status_code == 401
    assert "Credenciales inválidas" in response.json()["detail"]


def test_get_current_user_success(client: TestClient, test_user_data: dict):
    """Test getting current user with valid token"""
    # Register user
    client.post("/api/v1/auth/register", json=test_user_data)
    
    # Login
    login_data = {
        "email": test_user_data["email"],
        "password": test_user_data["password"]
    }
    login_response = client.post("/api/v1/auth/login", json=login_data)
    token = login_response.json()["access_token"]
    
    # Get current user
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/v1/auth/me", headers=headers)
    
    assert response.status_code == 200
    data = response.json()
    
    assert data["email"] == test_user_data["email"]
    assert data["username"] == test_user_data["username"]
    assert "id" in data


def test_get_current_user_invalid_token(client: TestClient):
    """Test getting current user with invalid token"""
    headers = {"Authorization": "Bearer invalid_token"}
    response = client.get("/api/v1/auth/me", headers=headers)
    
    assert response.status_code == 401


def test_get_current_user_no_token(client: TestClient):
    """Test getting current user without token"""
    response = client.get("/api/v1/auth/me")
    
    assert response.status_code == 403  # Missing authorization header
