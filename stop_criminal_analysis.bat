@echo off
title Stop Criminal Analysis Platform
echo Stopping Criminal Analysis processes on port 5173 and 8000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do taskkill /f /pid %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000') do taskkill /f /pid %%a 2>nul
echo Done!
timeout /t 2
