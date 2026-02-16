import sys
import os

# Add current directory to path so we can import app modules
sys.path.append(os.getcwd())

from app.db.session import SessionLocal
from app.db.models import User

def list_users():
    db = SessionLocal()
    try:
        users = db.query(User).all()
        if not users:
            print("No users found.")
        for user in users:
            print(f"User: {user.email}, Role: {user.role.value}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    list_users()
