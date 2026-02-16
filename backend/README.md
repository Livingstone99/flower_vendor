# Backend (FastAPI)

## Quick Start

### Prerequisites

**Important**: Make sure the PostgreSQL database is running before starting the backend:

```bash
# From the project root
./start_db.sh
```

### Using Scripts (Recommended)

```bash
# Start the server
./start.sh

# Stop the server
./stop.sh

# Restart the server
./restart.sh

# Check server status
./status.sh
```

The `start.sh` script will:
- Create virtual environment if it doesn't exist
- Install/update dependencies
- Run database migrations
- Start the server on http://localhost:8000

**Note**: If you get database connection errors, make sure the database is running with `./start_db.sh` from the project root.

### Manual Start

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp env.example .env
uvicorn app.main:app --reload
```

## Migrations

```bash
alembic upgrade head
```

## Create Admin User

To create an admin user for accessing the admin dashboard:

```bash
python create_admin.py
```

This will prompt you for:
- Email address
- Name (optional)
- Password

After creating the admin user, you can log in at:
- Frontend: http://localhost:3000/admin/login
- Use the email and password you just created


