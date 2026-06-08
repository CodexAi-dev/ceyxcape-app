@echo off
REM CeyXcape Project Quick Start Script
REM This script starts all services for development

echo.
echo ========================================
echo    CeyXcape Tourism Platform - Setup
echo ========================================
echo.

REM Check if Docker is running
docker ps >nul 2>&1
if errorlevel 1 (
    echo [!] Docker is not running. Please start Docker Desktop first.
    exit /b 1
)

echo [*] Stopping any running containers...
docker-compose -f docker/docker-compose.yml down 2>nul

echo [*] Starting PostgreSQL database...
docker-compose -f docker/docker-compose.yml up -d postgres

REM Wait for database to be ready
echo [*] Waiting for database to be ready...
timeout /t 5 /nobreak

echo.
echo ========================================
echo [✓] Database started successfully!
echo ========================================
echo.

echo [*] To complete setup, run these commands in separate terminals:
echo.
echo Terminal 1 (Backend):
echo   cd backend
echo   npm install
echo   npm run start:dev
echo.
echo Terminal 2 (Frontend):
echo   cd frontend
echo   npm install
echo   npm run dev
echo.
echo Then open your browser:
echo   - Frontend: http://localhost:3000
echo   - Backend API: http://localhost:3001/api
echo.
