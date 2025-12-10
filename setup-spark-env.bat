@echo off
echo ======================================================================
echo   Setting up Spark Environment with Python 3.11
echo ======================================================================
echo.

echo [1/5] Creating Python 3.11 environment...
conda create -n spark-env python=3.11 -y

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to create environment
    echo Make sure Anaconda/Miniconda is installed
    pause
    exit /b 1
)

echo.
echo [2/5] Installing PySpark and dependencies...
call conda run -n spark-env pip install pyspark==3.5.0 findspark pandas numpy matplotlib seaborn plotly textblob jupyter ipython

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to install packages
    pause
    exit /b 1
)

echo.
echo [3/5] Verifying installation...
call conda run -n spark-env python --version

echo.
echo ======================================================================
echo   SUCCESS! Environment is ready
echo ======================================================================
echo.
echo NEXT STEPS:
echo.
echo 1. Run: conda activate spark-env
echo 2. Run: jupyter notebook
echo 3. Open: prototype-colab-dataset-analysis.ipynb
echo 4. Run the notebook cells - Spark jobs will work!
echo.
echo ======================================================================
echo.

set /p LAUNCH="Start Jupyter now? (Y/N): "
if /i "%LAUNCH%"=="Y" (
    echo.
    echo Starting Jupyter Notebook...
    call conda activate spark-env
    jupyter notebook
)

pause
