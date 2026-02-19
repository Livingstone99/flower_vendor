# Flower Vendor Setup Complete! 🌸

## ✅ What's Been Configured

### Database
- **Type**: Local PostgreSQL
- **Database**: `flower_vendor`
- **User**: `flower`
- **Password**: `flower`
- **Host**: `localhost:5432`
- **Status**: ✅ Created and migrated

### Admin User
- **Email**: `admin@admin.com`
- **Password**: `admin123`
- **Role**: Admin
- **Status**: ✅ Created

### Backend
- **Framework**: FastAPI
- **Port**: 8000
- **API Docs**: http://localhost:8000/docs
- **Status**: Ready to start

### Frontend
- **Framework**: Next.js
- **Port**: 3000
- **Admin Dashboard**: http://localhost:3000/admin/login
- **Status**: Ready to start

## 🚀 Quick Start

### 1. Start the Backend
```bash
cd backend
./start.sh
```

The server will:
- Activate the virtual environment
- Install/update dependencies
- Run database migrations
- Start on http://localhost:8000
- Display logs in the terminal

### 2. Start the Frontend (in a new terminal)
```bash
cd web
npm install  # First time only
npm run dev
```

The frontend will start on http://localhost:3000

### 3. Access the Admin Dashboard
1. Open: http://localhost:3000/admin/login
2. Login with:
   - Email: `admin@admin.com`
   - Password: `admin123`

## 📋 Available Scripts

### Backend
- `./start.sh` - Start the backend server (shows logs)
- `./stop.sh` - Stop the backend server
- `./restart.sh` - Restart the backend server
- `./status.sh` - Check if server is running
- `python create_admin.py` - Create additional admin users

### Database
- `./setup_local_db.sh` - Setup local PostgreSQL (already done)
- `alembic upgrade head` - Run migrations
- `alembic revision --autogenerate -m "message"` - Create new migration

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linter

## 🔧 Configuration Files

### Backend
- `backend/.env` - Environment variables (DATABASE_URL, JWT_SECRET, etc.)
- `backend/requirements.txt` - Python dependencies
- `backend/alembic.ini` - Database migration config

### Frontend
- `web/.env.local` - Frontend environment variables (if needed)
- `web/package.json` - Node.js dependencies
- `web/tailwind.config.ts` - Tailwind CSS config

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🎯 Next Steps

1. **Start both servers** (backend and frontend)
2. **Login to admin dashboard** at http://localhost:3000/admin/login
3. **Create nurseries** - Add flower nurseries with locations
4. **Add products** - Create flower products
5. **Manage inventory** - Set inventory per nursery
6. **Process orders** - Handle order fulfillment and delivery

## 🐛 Troubleshooting

### Backend won't start
- Check if PostgreSQL is running: `pg_isready`
- Check if port 8000 is available: `lsof -i :8000`
- Check logs: `tail -f backend/.pid/uvicorn.log`

### Frontend won't start
- Check if port 3000 is available: `lsof -i :3000`
- Try clearing cache: `rm -rf web/.next`
- Reinstall dependencies: `cd web && rm -rf node_modules && npm install`

### Database connection errors
- Verify PostgreSQL is running: `pg_isready`
- Check connection: `psql -U flower -d flower_vendor -c "SELECT 1"`
- Verify DATABASE_URL in `backend/.env`

### Can't login to admin
- Verify admin user exists: 
  ```bash
  cd backend
  psql -U flower -d flower_vendor -c "SELECT email, role FROM users WHERE role='admin'"
  ```
- Create new admin: `python create_admin.py`

## 📝 Notes

- The bcrypt warning "(trapped) error reading bcrypt version" is harmless and can be ignored
- Admin dashboard features include:
  - Nursery management (CRUD + inventory)
  - Product management (CRUD + active/inactive toggle)
  - Order management (view, allocate, confirm, assign delivery)
  - Fulfillment workflow (split orders across nurseries)

## 🔐 Security Notes

**For Development Only:**
- Change default passwords before production
- Update JWT_SECRET in `.env`
- Enable HTTPS in production
- Review CORS settings
- Add rate limiting
- Implement proper authentication for OAuth providers

---

**Happy coding! 🌸**


