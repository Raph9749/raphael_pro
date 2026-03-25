from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_password_reset_token,
    create_refresh_token,
    hash_password,
    verify_password,
    verify_password_reset_token,
    verify_token,
)
from app.models.user import User


def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    """Authenticate a user by email and password."""
    user = db.query(User).filter(
        User.email == email,
        User.is_active == True,
        User.is_deleted == False,
    ).first()
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    # Update last login
    user.last_login = datetime.now(timezone.utc)
    db.commit()
    db.refresh(user)
    return user


def create_tokens(user: User) -> dict:
    """Create access and refresh tokens for a user."""
    token_data = {"sub": str(user.id)}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    }


def refresh_access_token(refresh_token_str: str) -> Optional[dict]:
    """Refresh an access token using a refresh token."""
    payload = verify_token(refresh_token_str, token_type="refresh")
    if payload is None:
        return None
    user_id = payload.get("sub")
    if user_id is None:
        return None
    token_data = {"sub": user_id}
    new_access_token = create_access_token(token_data)
    new_refresh_token = create_refresh_token(token_data)
    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    }


def initiate_password_reset(db: Session, email: str) -> Optional[str]:
    """Generate a password reset token if the user exists."""
    user = db.query(User).filter(User.email == email, User.is_active == True).first()
    if not user:
        return None
    return create_password_reset_token(email)


def reset_password(db: Session, token: str, new_password: str) -> bool:
    """Reset a user's password using a valid reset token."""
    email = verify_password_reset_token(token)
    if email is None:
        return False
    user = db.query(User).filter(User.email == email, User.is_active == True).first()
    if not user:
        return False
    user.hashed_password = hash_password(new_password)
    db.commit()
    return True
