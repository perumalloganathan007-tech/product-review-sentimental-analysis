@echo off
echo ============================================
echo Starting Scala Play Framework with Spark
echo ============================================

REM Create Spark event log directory
if not exist "tmp\spark-events" mkdir tmp\spark-events

REM Set Java options for Spark
set JAVA_OPTS=-Xmx4g -XX:+UseG1GC

echo.
echo [1/3] Cleaning previous build...
call sbt clean

echo.
echo [2/3] Compiling project...
call sbt compile

echo.
echo [3/3] Starting application...
echo.
echo Spark Web UI will be available at: http://localhost:4040
echo Application will be available at: http://localhost:9000
echo Spark Dashboard: http://localhost:9000/spark-dashboard.html
echo.
echo Press Ctrl+C to stop the application
echo.

call sbt run

pause
