# Flower Vendor (MVP)

Monorepo for a flower e-commerce MVP:

- **Backend**: FastAPI + Postgres (catalog, orders, admin APIs)
- **Web**: Next.js storefront + admin dashboard (theme: `#7d2fd0` + white)
- **Auth**: Storefront is public; customers sign in with Google/Facebook at checkout; admins log into dashboard

## Local dev (high-level)

1. Setup PostgreSQL Database:

```bash
# One-time setup for local PostgreSQL
./setup_local_db.sh
```

This creates the `flower` user and `flower_vendor` database on your local PostgreSQL installation.

2. Backend:

```bash
cd backend
./start.sh
```

3. Web:

```bash
cd web
npm install
npm run dev
```

## Database Setup

### Using Local PostgreSQL (Recommended if already installed)

```bash
./setup_local_db.sh
```

This script will:
- Create the `flower` user (password: `flower`)
- Create the `flower_vendor` database
- Grant necessary privileges
- Test the connection

### Using Docker PostgreSQL (Alternative)

If you prefer Docker and have Docker Desktop installed and logged in:

```bash
./start_db.sh   # Start database
./stop_db.sh    # Stop database
```

### Database Connection Details

- Host: localhost:5432
- Database: flower_vendor
- Username: flower
- Password: flower

## Environment variables

- Backend: see `backend/env.example`
- Web: see `web/env.example`


