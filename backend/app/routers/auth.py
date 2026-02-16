"""
Authentication endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.core.security import create_access_token, get_password_hash, verify_password, verify_google_token, verify_facebook_token
from app.db.models import OAuthAccount, OAuthProvider, User, UserRole
from app.db.session import get_db
from app.schemas.auth import AdminLoginRequest, OAuthTokenRequest, TokenResponse, UserResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
async def admin_login(request: AdminLoginRequest, db: Session = Depends(get_db)):
    """Admin email/password login."""
    user = db.query(User).filter(User.email == request.email).first()
    if not user or user.role not in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    if not user.hashed_password or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    access_token = create_access_token(data={"sub": user.id, "role": user.role.value})
    return TokenResponse(access_token=access_token)


@router.post("/oauth/google", response_model=TokenResponse)
async def oauth_google(request: OAuthTokenRequest, db: Session = Depends(get_db)):
    """Exchange Google OAuth token for backend JWT."""
    id_info = verify_google_token(request.provider_token)
    if not id_info:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token",
        )

    provider_account_id = id_info["sub"]
    email = id_info.get("email")
    name = id_info.get("name")
    
    # Find or create user
    oauth_account = db.query(OAuthAccount).filter(
        OAuthAccount.provider == OAuthProvider.GOOGLE,
        OAuthAccount.provider_account_id == provider_account_id
    ).first()
    
    if oauth_account:
        user = oauth_account.user
    else:
        # Check if user with this email already exists
        user = db.query(User).filter(User.email == email).first()
        if not user:
            # Create new user
            user = User(
                email=email,
                name=name,
                role=UserRole.CUSTOMER
            )
            db.add(user)
            db.flush()
        
        # Link OAuth account
        oauth_account = OAuthAccount(
            user_id=user.id,
            provider=OAuthProvider.GOOGLE,
            provider_account_id=provider_account_id
        )
        db.add(oauth_account)
        db.commit()
        db.refresh(user)
    
    access_token = create_access_token(data={"sub": user.id, "role": user.role.value})
    return TokenResponse(access_token=access_token)


@router.post("/oauth/facebook", response_model=TokenResponse)
async def oauth_facebook(request: OAuthTokenRequest, db: Session = Depends(get_db)):
    """Exchange Facebook OAuth token for backend JWT."""
    user_data = verify_facebook_token(request.provider_token)
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Facebook token",
        )

    provider_account_id = user_data["id"]
    email = user_data.get("email")
    name = user_data.get("name")
    
    # Find or create user
    oauth_account = db.query(OAuthAccount).filter(
        OAuthAccount.provider == OAuthProvider.FACEBOOK,
        OAuthAccount.provider_account_id == provider_account_id
    ).first()
    
    if oauth_account:
        user = oauth_account.user
    else:
        # Check if user with this email already exists
        user = db.query(User).filter(User.email == email).first()
        if not user:
            # Create new user
            user = User(
                email=email if email else f"facebook_{provider_account_id}@example.com",
                name=name,
                role=UserRole.CUSTOMER
            )
            db.add(user)
            db.flush()
        
        # Link OAuth account
        oauth_account = OAuthAccount(
            user_id=user.id,
            provider=OAuthProvider.FACEBOOK,
            provider_account_id=provider_account_id
        )
        db.add(oauth_account)
        db.commit()
        db.refresh(user)
    
    access_token = create_access_token(data={"sub": user.id, "role": user.role.value})
    return TokenResponse(access_token=access_token)


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user profile."""
    return UserResponse.model_validate(current_user)



