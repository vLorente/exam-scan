import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import get_session
from app.models.user import User
from sqlmodel import Session

client = TestClient(app)

@pytest.fixture
def test_user():
    return {
        "email": "testuser@example.com",
        "username": "testuser",
        "full_name": "Test User",
        "hashed_password": "hashed_password_123",
        "is_active": True
    }

@pytest.fixture(autouse=True)
def clear_users():
    # Limpiar usuarios antes de cada test
    from sqlmodel import select
    session_generator = get_session()
    session: Session = next(session_generator)
    users = session.exec(select(User)).all()
    for user in users:
        session.delete(user)
    session.commit()


def test_create_user(test_user):
    response = client.post("/api/v1/users/", json=test_user)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == test_user["email"]
    assert data["username"] == test_user["username"]
    assert data["full_name"] == test_user["full_name"]
    assert data["is_active"] is True
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data


def test_list_users(test_user):
    client.post("/api/v1/users/", json=test_user)
    response = client.get("/api/v1/users/")
    assert response.status_code == 200
    users = response.json()
    assert any(u["email"] == test_user["email"] for u in users)


def test_get_user(test_user):
    create_resp = client.post("/api/v1/users/", json=test_user)
    user_id = create_resp.json()["id"]
    response = client.get(f"/api/v1/users/{user_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == user_id
    assert data["email"] == test_user["email"]


def test_update_user(test_user):
    create_resp = client.post("/api/v1/users/", json=test_user)
    user_id = create_resp.json()["id"]
    update_data = {"full_name": "Updated Name"}
    response = client.put(f"/api/v1/users/{user_id}", json={**test_user, **update_data})
    assert response.status_code == 200
    data = response.json()
    assert data["full_name"] == "Updated Name"


def test_delete_user(test_user):
    create_resp = client.post("/api/v1/users/", json=test_user)
    user_id = create_resp.json()["id"]
    response = client.delete(f"/api/v1/users/{user_id}")
    assert response.status_code == 204
    # Verificar que ya no existe
    get_resp = client.get(f"/api/v1/users/{user_id}")
    assert get_resp.status_code == 404


def test_get_nonexistent_user():
    """Test getting a user that doesn't exist"""
    response = client.get("/api/v1/users/99999")
    assert response.status_code == 404
    assert "User not found" in response.json()["detail"]


def test_update_nonexistent_user(test_user):
    """Test updating a user that doesn't exist"""
    response = client.put("/api/v1/users/99999", json=test_user)
    assert response.status_code == 404
    assert "User not found" in response.json()["detail"]


def test_delete_nonexistent_user():
    """Test deleting a user that doesn't exist"""
    response = client.delete("/api/v1/users/99999")
    assert response.status_code == 404
    assert "User not found" in response.json()["detail"]


def test_create_user_duplicate_email(test_user):
    """Test creating a user with duplicate email"""
    # Crear primer usuario
    client.post("/api/v1/users/", json=test_user)
    
    # Intentar crear otro con el mismo email
    duplicate_user = {**test_user, "username": "different_username"}
    response = client.post("/api/v1/users/", json=duplicate_user)
    assert response.status_code == 400
    assert "email already exists" in response.json()["detail"]


def test_create_user_invalid_data():
    """Test creating a user with invalid data"""
    invalid_user = {
        "email": "invalid-email",  # Email inválido
        "username": "",  # Username vacío
        "full_name": "Test User"
        # Sin hashed_password requerido
    }
    response = client.post("/api/v1/users/", json=invalid_user)
    assert response.status_code == 422  # Password missing validation
