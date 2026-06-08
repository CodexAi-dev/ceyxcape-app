# CeyXcape Tourism Platform - Next.js + Nest.js Migration

**Status:** Development Environment Setup  
**Date:** May 8, 2026  
**Project Version:** 2.0

## Project Structure

```
ceyxcape-app/
├── backend/              # Nest.js API Server
├── frontend/             # Next.js React App
├── docker/               # Docker configuration
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm 9+
- Docker & Docker Compose (for database)
- PostgreSQL 14+ (managed via Docker)

### Quick Start

1. **Start the database**
   ```bash
   cd docker
   docker-compose up -d
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   npm run start:dev
   ```

3. **Setup Frontend** (in another terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access Applications**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Docs (Swagger): http://localhost:3001/api

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/ceyxcape
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=7d
NODE_ENV=development
PORT=3001
PAYHERE_MERCHANT_ID=your_merchant_id
PAYHERE_MERCHANT_SECRET=your_merchant_secret
PAYHERE_SANDBOX=true
TWILIO_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_FROM=your_phone_number
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=CeyXcape
NEXT_PUBLIC_APP_DESCRIPTION=Private Sri Lanka Tours
```

## Development Commands

### Backend
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:prod` - Start in production mode
- `npm run build` - Build for production
- `npm test` - Run unit tests
- `npm run test:e2e` - Run E2E tests
- `npm run typeorm migration:generate` - Generate database migration
- `npm run typeorm migration:run` - Run pending migrations

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types
- `npm test` - Run tests

## API Documentation

### Swagger Documentation
Once backend is running, visit: http://localhost:3001/api

### Base URL
- Development: `http://localhost:3001/api`
- Production: `https://api.ceyxcape.com`

## Database

### Connection Details
- **Host:** localhost
- **Port:** 5432
- **Database:** ceyxcape
- **User:** postgres
- **Password:** postgres

### Connect via PostgreSQL Client
```bash
psql postgresql://postgres:postgres@localhost:5432/ceyxcape
```

## Project Architecture

### Backend (Nest.js)
- **Framework:** Nest.js with Express
- **ORM:** TypeORM with PostgreSQL
- **Authentication:** JWT + Sessions
- **Validation:** class-validator
- **Documentation:** Swagger/OpenAPI
- **Testing:** Jest + Supertest

### Frontend (Next.js)
- **Framework:** Next.js 14 with App Router
- **UI Library:** React 18
- **Styling:** Tailwind CSS
- **State Management:** React Context + Hooks
- **Forms:** React Hook Form
- **Testing:** Jest + React Testing Library
- **E2E:** Cypress/Playwright

## Deployment

### Docker Deployment
```bash
docker-compose -f docker-compose.prod.yml up
```

### Environment-Specific Configs
- Development: `.env.development`
- Testing: `.env.test`
- Production: `.env.production`

## Monitoring & Logs

### Backend Logs
```bash
docker logs ceyxcape-backend
```

### Database Logs
```bash
docker logs ceyxcape-db
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3001 (backend)
lsof -ti :3001 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti :3000 | xargs kill -9
```

### Database Connection Issues
```bash
# Check if Docker container is running
docker ps | grep ceyxcape

# Restart database
docker-compose restart postgres
```

### Clear Node Modules & Reinstall
```bash
# Backend
cd backend && rm -rf node_modules package-lock.json && npm install

# Frontend
cd frontend && rm -rf node_modules package-lock.json && npm install
```

## Contributing

1. Create a feature branch: `git checkout -b feature/feature-name`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/feature-name`
4. Submit pull request

## Support

For issues and questions:
- Check documentation in `/docs`
- Review API documentation in `/backend/docs`
- Check migration plan: `PROJECT_ANALYSIS_AND_MIGRATION_PLAN.md`

---

**Last Updated:** May 8, 2026  
**Maintained by:** Development Team
