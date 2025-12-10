@echo off
title Sentiment Analysis API Server
color 0A
cd /d "%~dp0"
echo.
echo ========================================
echo   Sentiment Analysis API Server
echo ========================================
echo.
echo Starting server on http://localhost:9000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.
node mock-server.js
pause
