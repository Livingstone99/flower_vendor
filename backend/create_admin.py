"""
Script to create an admin user in the database.
Run this from the backend directory: python create_admin.py
"""

import sys
from getpass import getpass

from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.db.models import User, UserRole
from app.db.session import SessionLocal


def create_admin():
    db: Session = SessionLocal()
    try:
        print("Create Admin/Super Admin User")
        print("=" * 40)
        email = input("Email: ").strip()
        if not email:
            print("Email is required!")
            return

        # Check if user already exists
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            print(f"User with email {email} already exists!")
            print(f"Current role: {existing.role.value}")
            update = input("Update user role? (y/n): ").strip().lower()
            if update == "y":
                print("\nSelect role:")
                print("1. Customer")
                print("2. Admin")
                print("3. Super Admin")
                role_choice = input("Enter choice (1-3): ").strip()
                
                role_map = {
                    "1": UserRole.CUSTOMER,
                    "2": UserRole.ADMIN,
                    "3": UserRole.SUPER_ADMIN,
                }
                
                if role_choice in role_map:
                    existing.role = role_map[role_choice]
                    if not existing.hashed_password:
                        password = getpass("Password: ")
                        existing.hashed_password = get_password_hash(password)
                    db.commit()
                    print(f"User {email} role updated to {existing.role.value}!")
                else:
                    print("Invalid choice!")
            return

        name = input("Name (optional): ").strip() or None
        
        print("\nSelect role:")
        print("1. Customer")
        print("2. Admin")
        print("3. Super Admin")
        role_choice = input("Enter choice (1-3, default: 2): ").strip() or "2"
        
        role_map = {
            "1": UserRole.CUSTOMER,
            "2": UserRole.ADMIN,
            "3": UserRole.SUPER_ADMIN,
        }
        
        if role_choice not in role_map:
            print("Invalid choice! Defaulting to Admin.")
            role = UserRole.ADMIN
        else:
            role = role_map[role_choice]
        
        password = getpass("Password: ")
        if not password:
            print("Password is required!")
            return

        user = User(
            email=email,
            name=name,
            role=role,
            hashed_password=get_password_hash(password),
        )
        db.add(user)
        db.commit()
        print(f"\nUser '{email}' created successfully with role: {role.value}!")
        if role in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
            print("You can now log in at http://localhost:3000/admin/login")
    except KeyboardInterrupt:
        print("\n\nCancelled.")
    except Exception as e:
        print(f"\nError: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    create_admin()

