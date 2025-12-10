@echo off
title Sentiment Analysis - Spark + Node.js

echo ========================================
echo  Sentiment Analysis with Spark
echo ========================================
echo.

REM Start Node.js mock server
echo [1/2] Starting Node.js server on port 9000...
start "Node.js API Server" cmd /k "node mock-server.js"
timeout /t 3 /nobreak >nul

REM Check if Spark is running
echo [2/2] Checking Spark connection...
curl -s http://localhost:4040 >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Spark is already running on port 4040
) else (
    echo ⚠️  Spark is not running. Jobs won't be visible in Spark UI.
    echo    To start Spark, run: spark-shell --master local[*]
)

echo.
echo ========================================
echo  Services Status:
echo ========================================
echo  ✅ Node.js API: http://localhost:9000
echo  📱 Main App: http://localhost:9000/main-app.html
echo  🔥 Spark UI: http://localhost:4040
echo ========================================
echo.
echo Opening application...
timeout /t 2 /nobreak >nul
start http://localhost:9000/main-app.html

echo.
echo System is ready! Process your data to see Spark jobs.
echo Close this window to stop the Node.js server.
pause
