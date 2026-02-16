
import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.db.models import User, UserRole, OAuthProvider, OAuthAccount
from app.core.security import get_password_hash

def test_admin_login(client: TestClient, db: Session, override_get_db):
    # Create admin user
    admin_password = "adminpassword"
    hashed = get_password_hash(admin_password)
    admin = User(
        email="admin@example.com",
        role=UserRole.ADMIN,
        hashed_password=hashed
    )
    db.add(admin)
    db.commit()

    # Test success
    response = client.post(
        "/auth/login",
        json={"email": "admin@example.com", "password": admin_password}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

    # Test wrong password
    response = client.post(
        "/auth/login",
        json={"email": "admin@example.com", "password": "wrong"}
    )
    assert response.status_code == 401

@patch("app.routers.auth.verify_google_token")
def test_google_login(mock_verify, client: TestClient, db: Session, override_get_db):
    # Mock successful Google verification
    mock_verify.return_value = {
        "sub": "google_123",
        "email": "google@example.com",
        "name": "Google User"
    }

    response = client.post(
        "/auth/oauth/google",
        json={"provider_token": "valid_google_token", "provider": "google"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data

    # Verify user created
    user = db.query(User).filter(User.email == "google@example.com").first()
    assert user is not None
    assert user.name == "Google User"
    assert user.role == UserRole.CUSTOMER
    
    # Verify oauth account linked
    oauth = db.query(OAuthAccount).filter(
        OAuthAccount.provider == OAuthProvider.GOOGLE,
        OAuthAccount.provider_account_id == "google_123"
    ).first()
    assert oauth is not None
    assert oauth.user_id == user.id

def test_google_login_invalid_token(client: TestClient, override_get_db):
    with patch("app.routers.auth.verify_google_token", return_value=None):
        response = client.post(
            "/auth/oauth/google",
            json={"provider_token": "invalid", "provider": "google"}
        )
        assert response.status_code == 401

@patch("app.routers.auth.verify_facebook_token")
def test_facebook_login(mock_verify, client: TestClient, db: Session, override_get_db):
    # Mock successful Facebook verification
    mock_verify.return_value = {
        "id": "facebook_123",
        "email": "facebook@example.com",
        "name": "Facebook User"
    }

    response = client.post(
        "/auth/oauth/facebook",
        json={"provider_token": "valid_facebook_token", "provider": "facebook"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data

    # Verify user created
    user = db.query(User).filter(User.email == "facebook@example.com").first()
    assert user is not None
    assert user.name == "Facebook User"

def test_login_existing_user(client: TestClient, db: Session, override_get_db):
    # Create user first
    user = User(email="existing@example.com", role=UserRole.CUSTOMER)
    db.add(user)
    db.commit()

    # Login with Google with same email
    with patch("app.routers.auth.verify_google_token") as mock_verify:
        mock_verify.return_value = {
            "sub": "google_existing",
            "email": "existing@example.com",
            "name": "Existing User"
        }
        
        response = client.post(
            "/auth/oauth/google",
            json={"provider_token": "token", "provider": "google"}
        )
        assert response.status_code == 200
        
        # Verify OAuth account added to existing user
        # user = db.query(User).filter(User.email == "existing@example.com").first()
        # The above query might get a stale object if we don't refresh or start new session,
        # but in this test setup `db` is the session.
        
        oauth = db.query(OAuthAccount).filter(
            OAuthAccount.provider == OAuthProvider.GOOGLE,
            OAuthAccount.provider_account_id == "google_existing"
        ).first()
        assert oauth is not None
        assert oauth.user_id == user.id
