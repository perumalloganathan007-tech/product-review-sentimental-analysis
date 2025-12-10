@echo off
echo ======================================================================
echo   Setting up Python 3.11 Environment on D: Drive (You have space!)
echo ======================================================================
echo.
echo Your disk space:
echo   C: drive: Only 0.2 GB free (TOO LOW!)
echo   D: drive: 127 GB free (PERFECT!)
echo.
echo Installing to D: drive...
echo.

echo [1/4] Creating virtual environment on D: drive...
py -3.11 -m venv "D:\spark-python311-env"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to create virtual environment
    pause
    exit /b 1
)

echo.
echo [2/4] Activating environment and upgrading pip...
call "D:\spark-python311-env\Scripts\activate.bat"
python -m pip install --upgrade pip

echo.
echo [3/4] Installing packages...
echo    This will take a few minutes...
pip install pyspark==3.5.0 findspark pandas numpy matplotlib seaborn plotly textblob jupyter ipython

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Package installation failed
    pause
    exit /b 1
)

echo.
echo [4/4] Verifying installation...
python --version
python -c "import pyspark; print('PySpark:', pyspark.__version__)"

echo.
echo ======================================================================
echo   SUCCESS! Environment ready on D: drive
echo ======================================================================
echo.
echo Environment location: D:\spark-python311-env
echo.
echo NEXT STEPS:
echo.
echo 1. Activate environment:
echo    D:\spark-python311-env\Scripts\activate
echo.
echo 2. Navigate to your project:
echo    cd "d:\project zip flies\scala project\scala project"
echo.
echo 3. Start Jupyter:
echo    jupyter notebook
echo.
echo 4. Open: prototype-colab-dataset-analysis.ipynb
echo.
echo ======================================================================
echo.

set /p LAUNCH="Start Jupyter now? (Y/N): "
if /i "%LAUNCH%"=="Y" (
    echo.
    cd "d:\project zip flies\scala project\scala project"
    jupyter notebook
)

pause
