@echo off
echo ========================================
echo Starting Jupyter with Python 3.11
echo ========================================
echo.

cd /d "%~dp0"

echo Activating Python 3.11 environment...
call spark-python311-env\Scripts\activate.bat

echo.
echo Environment activated!
echo Python version:
python --version

echo.
echo Starting Jupyter Notebook...
echo.
echo =========================================
echo Your browser will open automatically
echo Close this window to stop Jupyter
echo =========================================
echo.

jupyter notebook

pause
