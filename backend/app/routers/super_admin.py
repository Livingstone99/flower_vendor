"""
Super admin endpoints for system-wide management and monitoring.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_super_admin_user
from app.core.security import get_password_hash
from app.db.models import User, UserRole, Order, Product, Nursery
from app.db.session import get_db
from app.schemas.auth import UserResponse

router = APIRouter(prefix="/super-admin", tags=["super-admin"])


@router.get("/metrics")
async def get_system_metrics(
    current_user: User = Depends(get_current_super_admin_user),
    db: Session = Depends(get_db),
):
    """Get system-wide metrics for the super admin dashboard."""
    # User counts by role
    user_counts = (
        db.query(User.role, func.count(User.id))
        .group_by(User.role)
        .all()
    )
    users_by_role = {role.value: count for role, count in user_counts}
    
    # Order statistics
    total_orders = db.query(func.count(Order.id)).scalar()
    total_revenue = db.query(func.sum(Order.total_cents)).scalar() or 0
    
    # Product and nursery counts
    total_products = db.query(func.count(Product.id)).scalar()
    total_nurseries = db.query(func.count(Nursery.id)).scalar()
    
    # Recent activity
    recent_orders = (
        db.query(Order)
        .order_by(Order.created_at.desc())
        .limit(10)
        .all()
    )
    
    return {
        "users": {
            "total": sum(users_by_role.values()),
            "by_role": users_by_role,
        },
        "orders": {
            "total": total_orders,
            "total_revenue_cents": total_revenue,
        },
        "products": {
            "total": total_products,
        },
        "nurseries": {
            "total": total_nurseries,
        },
        "recent_activity": {
            "orders": [
                {
                    "id": order.id,
                    "status": order.status.value,
                    "total_cents": order.total_cents,
                    "created_at": order.created_at.isoformat(),
                }
                for order in recent_orders
            ]
        },
    }


@router.get("/users", response_model=List[UserResponse])
async def list_all_users(
    current_user: User = Depends(get_current_super_admin_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
):
    """List all users in the system."""
    users = db.query(User).offset(skip).limit(limit).all()
    return [UserResponse.model_validate(user) for user in users]


@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user_by_id(
    user_id: int,
    current_user: User = Depends(get_current_super_admin_user),
    db: Session = Depends(get_db),
):
    """Get a specific user by ID."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return UserResponse.model_validate(user)


@router.patch("/users/{user_id}/role")
async def update_user_role(
    user_id: int,
    role: UserRole,
    current_user: User = Depends(get_current_super_admin_user),
    db: Session = Depends(get_db),
):
    """Update a user's role."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    # Prevent super admin from demoting themselves
    if user.id == current_user.id and role != UserRole.SUPER_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot change your own role",
        )
    
    user.role = role
    db.commit()
    db.refresh(user)
    return UserResponse.model_validate(user)


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    current_user: User = Depends(get_current_super_admin_user),
    db: Session = Depends(get_db),
):
    """Delete a user from the system."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    # Prevent super admin from deleting themselves
    if user.id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account",
        )
    
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}


@router.post("/users")
async def create_user(
    email: str,
    name: str,
    role: UserRole,
    password: str = None,
    current_user: User = Depends(get_current_super_admin_user),
    db: Session = Depends(get_db),
):
    """Create a new user."""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists",
        )
    
    new_user = User(
        email=email,
        name=name,
        role=role,
        hashed_password=get_password_hash(password) if password else None,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return UserResponse.model_validate(new_user)

