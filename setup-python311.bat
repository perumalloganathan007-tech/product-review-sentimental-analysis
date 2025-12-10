@echo off
echo ======================================================================
echo   Setting up Python 3.11 Virtual Environment for Spark
echo ======================================================================
echo.

echo [1/4] Creating virtual environment with Python 3.11...
py -3.11 -m venv spark-venv

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to create virtual environment
    pause
    exit /b 1
)

echo.
echo [2/4] Activating environment and upgrading pip...
call spark-venv\Scripts\activate.bat
python -m pip install --upgrade pip

echo.
echo [3/4] Installing packages (this will take a few minutes)...
echo    Installing: pyspark, findspark, pandas, numpy, matplotlib, seaborn, plotly, textblob, jupyter
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
python -c "import pyspark; print('PySpark version:', pyspark.__version__)"

echo.
echo ======================================================================
echo   SUCCESS! Python 3.11 environment is ready
echo ======================================================================
echo.
echo NEXT STEPS:
echo.
echo 1. Activate the environment (run this command):
echo    spark-venv\Scripts\activate
echo.
echo 2. Start Jupyter Notebook:
echo    jupyter notebook
echo.
echo 3. Open: prototype-colab-dataset-analysis.ipynb
echo.
echo 4. Run the notebook - Spark jobs will work!
echo.
echo ======================================================================
echo.

set /p LAUNCH="Start Jupyter now? (Y/N): "
if /i "%LAUNCH%"=="Y" (
    echo.
    echo Starting Jupyter Notebook...
    jupyter notebook
) else (
    echo.
    echo To start later, run:
    echo   spark-venv\Scripts\activate
    echo   jupyter notebook
)

pause
