from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.user import (
    LoginRequest,
    TokenResponse,
    RefreshTokenRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    UserResponse,
)
from app.services.auth_service import (
    authenticate_user,
    create_tokens,
    refresh_access_token,
    initiate_password_reset,
    reset_password,
)

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate a user and return JWT tokens."""
    user = authenticate_user(db, request.email, request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect",
            headers={"WWW-Authenticate": "Bearer"},
        )
    tokens = create_tokens(user)
    user_response = UserResponse.model_validate(user)
    return TokenResponse(
        access_token=tokens["access_token"],
        refresh_token=tokens["refresh_token"],
        token_type=tokens["token_type"],
        expires_in=tokens["expires_in"],
        user=user_response,
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(request: RefreshTokenRequest, db: Session = Depends(get_db)):
    """Refresh an access token using a valid refresh token."""
    result = refresh_access_token(request.refresh_token)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de rafraîchissement invalide ou expiré",
        )
    # Fetch user for response
    from app.core.security import verify_token
    payload = verify_token(result["access_token"])
    user_id = payload.get("sub") if payload else None
    user = None
    if user_id:
        user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Utilisateur introuvable",
        )
    user_response = UserResponse.model_validate(user)
    return TokenResponse(
        access_token=result["access_token"],
        refresh_token=result["refresh_token"],
        token_type=result["token_type"],
        expires_in=result["expires_in"],
        user=user_response,
    )


@router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Initiate password reset (sends email with reset link - mocked)."""
    token = initiate_password_reset(db, request.email)
    # Always return success to avoid email enumeration
    return {
        "message": "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.",
        "success": True,
        # In development, return the token for testing
        "reset_token": token,
    }


@router.post("/reset-password")
async def reset_password_endpoint(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Reset password using a valid reset token."""
    success = reset_password(db, request.token, request.new_password)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token de réinitialisation invalide ou expiré",
        )
    return {"message": "Mot de passe réinitialisé avec succès", "success": True}


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current authenticated user profile."""
    return current_user
