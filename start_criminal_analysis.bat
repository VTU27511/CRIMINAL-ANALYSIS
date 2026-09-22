@echo off
title Criminal Analysis Platform Launcher
echo ===================================================
echo Starting Criminal Analysis Platform (Team Astra)
echo ===================================================
echo.
echo 1. Launching Backend server (FastAPI astra_api)...
start "Criminal Analysis Backend" cmd /k "cd /d %~dp0backend && \"c:\xampp\htdocs\NEw\backend\.venv\Scripts\python.exe\" -m uvicorn astra_api:app --host 0.0.0.0 --port 8000 --reload"

echo 2. Launching Frontend server (Vite + React UI)...
start "Criminal Analysis Frontend" cmd /k "cd /d %~dp0 && npm.cmd run dev -- --host 0.0.0.0 --port 5173"

echo 3. Waiting for servers to initialize...
timeout /t 3 /nobreak >nul

echo 4. Opening Criminal Analysis in your browser...
start http://localhost:5173

echo.
echo ===================================================
echo Criminal Analysis Platform is now running!
echo You can minimize this window.
echo ===================================================
timeout /t 3
