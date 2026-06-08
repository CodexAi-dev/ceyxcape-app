# 🚀 CeyXcape Project Setup Guide

## Prerequisites

### System Requirements
- **Node.js:** 18.x or higher (LTS)
- **npm:** 9.x or higher
- **Docker & Docker Compose:** Latest version
- **Git:** For version control
- **RAM:** Minimum 4GB (8GB recommended)
- **Disk Space:** Minimum 5GB

### Verify Installations

```powershell
# Check Node.js
node --version
# Should output: v18.x.x or higher

# Check npm
npm --version
# Should output: 9.x or higher

# Check Docker
docker --version
# Should output: Docker version 20.x or higher

# Check Docker Compose
docker-compose --version
# Should output: Docker Compose version 2.x or higher
```

---

## Step 1: Setup Database

### Start PostgreSQL with Docker

```powershell
cd docker
docker-compose up -d postgres
```

### Verify Database is Running

```powershell
# Check if container is running
docker ps | findstr postgres

# Connect to database (optional)
docker exec -it ceyxcape-db psql -U postgres -d ceyxcape
```

**Database Credentials:**
- Host: `localhost`
- Port: `5432`
- Username: `postgres`
- Password: `postgres`
- Database: `ceyxcape`

---

## Step 2: Setup Backend (Nest.js)

### Install Dependencies

```powershell
cd backend
npm install
```

**Installation Time:** ~3-5 minutes (first time)

### Create Environment File

The `.env` file is already created. Verify it contains:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ceyxcape
JWT_SECRET=dev_super_secret_jwt_key_12345678901234567890
PORT=3001
NODE_ENV=development
```

### Start Backend Development Server

```powershell
npm run start:dev
```

**Expected Output:**
```
[Nest] 12345   - 05/08/2026, 10:30:45 AM     LOG [NestFactory] Starting Nest application...
[Nest] 12345   - 05/08/2026, 10:30:46 AM     LOG [InstanceLoader] TypeOrmModule dependencies initialized
[Nest] 12345   - 05/08/2026, 10:30:47 AM     LOG [RoutesResolver] AppController {/api}: routes registered
[Nest] 12345   - 05/08/2026, 10:30:47 AM     LOG Application is running on: http://localhost:3001
[Nest] 12345   - 05/08/2026, 10:30:47 AM     LOG API Documentation: http://localhost:3001/api
```

### Verify Backend is Running

Open in browser: `http://localhost:3001`

Expected response:
```json
{
  "message": "Welcome to CeyXcape Tourism Platform API v2.0",
  "status": "running",
  "documentation": "/api",
  "endpoints": { ... }
}
```

### Access Swagger Documentation

Visit: `http://localhost:3001/api`

---

## Step 3: Setup Frontend (Next.js)

### Install Dependencies (in a new terminal)

```powershell
cd frontend
npm install
```

**Installation Time:** ~2-4 minutes (first time)

### Create Environment File

The `.env.local` file is already created. Verify it contains:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=CeyXcape
```

### Start Frontend Development Server

```powershell
npm run dev
```

**Expected Output:**
```
▲ Next.js 14.0.0
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 3.5s
```

### Verify Frontend is Running

Open in browser: `http://localhost:3000`

You should see the CeyXcape homepage with a "Welcome" message and status indicators.

---

## Step 4: Full Stack Testing

### Test API Connection

1. Go to `http://localhost:3000` (Frontend)
2. You should see green "✅ API Status: Connected"

### Test Database Connection

```powershell
# Backend logs should show database connection
# Look for: "TypeOrmModule dependencies initialized"

# Or connect directly to database
psql postgresql://postgres:postgres@localhost:5432/ceyxcape

# In psql, run:
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM tours;
```

### Test Sample Data

The database is pre-populated with:
- 1 admin user: `admin@ceyxcape.com` / `admin123`
- 5 sample tours

---

## Useful Commands

### Backend Commands

```powershell
# Development mode with hot reload
npm run start:dev

# Production build
npm run build

# Production run
npm run start:prod

# Run tests
npm test

# Generate database migration
npm run typeorm:migration:generate -- -n MigrationName

# Run pending migrations
npm run typeorm:migration:run

# Revert last migration
npm run typeorm:migration:revert
```

### Frontend Commands

```powershell
# Development server
npm run dev

# Production build
npm run build

# Production server
npm run start

# Type check
npm run type-check

# Run tests
npm test

# Linting
npm run lint
```

### Docker Commands

```powershell
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Rebuild services
docker-compose up -d --build

# Reset database
docker-compose down -v
docker-compose up -d
```

---

## Troubleshooting

### Port 3000 Already in Use

```powershell
# Find process on port 3000
netstat -ano | findstr :3000

# Kill process (replace PID with actual PID)
taskkill /PID <PID> /F
```

### Port 3001 Already in Use

```powershell
# Find process on port 3001
netstat -ano | findstr :3001

# Kill process
taskkill /PID <PID> /F
```

### Port 5432 Already in Use

```powershell
# Stop Docker container
docker stop ceyxcape-db

# Or change port in docker-compose.yml
# Change "5432:5432" to "5433:5432"
```

### Database Connection Error

```powershell
# Check if PostgreSQL is running
docker ps | findstr postgres

# Check Docker logs
docker logs ceyxcape-db

# Restart database
docker-compose restart postgres
```

### npm Install Issues

```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock file
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstall
npm install
```

### TypeScript Errors

```powershell
# Backend
npm run lint

# Frontend
npm run type-check
```

---

## Development Workflow

### Making Code Changes

1. **Backend Changes**
   - Edit files in `backend/src/**`
   - HMR (Hot Module Replacement) will automatically restart
   - Check terminal for any errors

2. **Frontend Changes**
   - Edit files in `frontend/src/**`
   - Changes reflect immediately in browser (Fast Refresh)
   - Check browser console for any errors

### Debugging

#### Backend
```powershell
# Run with debug output
npm run start:debug

# Connect debugger: chrome://inspect
```

#### Frontend
```powershell
# Use Next.js built-in dev tools
# Open browser DevTools: F12
# Network tab to see API calls
# Console tab for errors
```

---

## Environment Variables Guide

### Backend (.env)

| Variable | Example | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Environment mode |
| `PORT` | `3001` | Backend port |
| `DATABASE_URL` | `postgresql://...` | PostgreSQL connection |
| `JWT_SECRET` | `dev_secret_key` | JWT signing key |
| `CORS_ORIGIN` | `http://localhost:3000` | Frontend URL for CORS |

### Frontend (.env.local)

| Variable | Example | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001/api` | Backend API URL |
| `NEXT_PUBLIC_APP_NAME` | `CeyXcape` | Application name |

**Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

---

## Next Steps

1. **Explore the codebase**
   - Backend: `backend/src/app.module.ts`
   - Frontend: `frontend/src/app/page.tsx`

2. **Read the API Documentation**
   - Visit: `http://localhost:3001/api`

3. **Create your first module**
   - See migration plan for module structure

4. **Setup version control**
   ```powershell
   git init
   git add .
   git commit -m "Initial setup"
   ```

---

## Support & Resources

- **Project Plan:** `PROJECT_ANALYSIS_AND_MIGRATION_PLAN.md`
- **API Docs:** `http://localhost:3001/api` (Swagger)
- **Docker Docs:** https://docs.docker.com/
- **Nest.js Docs:** https://docs.nestjs.com/
- **Next.js Docs:** https://nextjs.org/docs

---

**Last Updated:** May 8, 2026  
**Status:** Ready for Development
