@echo off
title QuickBite Food Ordering System Launcher
color 0E
echo ===============================================================================
echo            QUICKBITE - FULL STACK ONLINE FOOD ORDERING SYSTEM
echo                 Java Spring Boot + React + MySQL + JWT
echo ===============================================================================
echo.

cd /d "%~dp0"

echo [1/3] Starting Spring Boot Backend (Port 8080)...
start "QuickBite Backend (Spring Boot 8080)" cmd /k "cd backend && mvn spring-boot:run"

echo [2/3] Starting React Frontend (Port 5173)...
start "QuickBite Frontend (React 5173)" cmd /k "cd frontend && npm.cmd run dev"

echo [3/3] Waiting for servers to initialize...
timeout /t 6 /nobreak >nul

echo Opening browser at http://localhost:5173 ...
start http://localhost:5173

echo.
echo ===============================================================================
echo   QuickBite is now running! Keep the backend and frontend windows open.
echo   - Frontend UI : http://localhost:5173
echo   - Backend API : http://localhost:8080/api/health
echo.
echo   DEMO CREDENTIALS:
echo   - Customer         : customer@foodie.com / password123
echo   - Restaurant Admin : admin@foodie.com    / password123
echo   - Delivery Courier : delivery@foodie.com / password123
echo ===============================================================================
echo.
pause
