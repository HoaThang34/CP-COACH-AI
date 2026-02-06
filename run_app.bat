@echo off
title CP Coach AI - Launcher
cls

echo ========================================================
echo   CP COACH AI - Starting Application
echo ========================================================

:: Check for Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH.
    echo Please install Python 3.9+ and try again.
    pause
    exit /b
)

:: Install Dependencies
echo [INFO] Checking and installing dependencies...
pip install -r requirements.txt >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Failed to install dependencies. Check your internet connection.
    pause
) else (
    echo [OK] Dependencies ready.
)

:: Open Browser
echo [INFO] Opening Browser...
timeout /t 3 >nul
start http://localhost:3434

:: Start Server
echo [INFO] Starting Flask Server...
echo [INFO] Press Ctrl+C to stop the server.
echo.
:: Run as module to ensure 'api' package is in path
python -m api.index

pause
