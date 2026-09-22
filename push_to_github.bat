@echo off
title Upload Criminal Analysis to GitHub
echo ===================================================
echo     Upload Criminal Analysis Project to GitHub
echo ===================================================
echo.

cd /d "%~dp0"

if not exist ".git" (
    echo [1/4] Initializing Git repository...
    git init
    git branch -M main
) else (
    echo [1/4] Git repository already initialized.
)

echo [2/4] Staging project files (ignoring node_modules)...
git add .

echo [3/4] Creating commit...
git commit -m "Initial commit: Team Astra Criminal Analysis Platform"

echo.
echo ===================================================
echo [4/4] Connect to your GitHub repository
echo ===================================================
echo 1. Go to https://github.com/new and create a new repository.
echo 2. Copy the repository URL (e.g., https://github.com/username/criminal-analysis.git)
echo.
set /p REPO_URL="Enter your GitHub Repository URL: "

if "%REPO_URL%"=="" (
    echo No URL provided. You can push manually anytime using:
    echo git remote add origin ^<your-url^>
    echo git push -u origin main
    pause
    exit /b
)

git remote remove origin 2>nul
git remote add origin %REPO_URL%
echo Pushing to GitHub main branch...
git push -u origin main

echo.
echo ===================================================
echo Done! Project successfully uploaded to GitHub.
echo ===================================================
pause
