# Setup Spark Environment with Python 3.11
# Run this script in PowerShell

Write-Host "=" -NoNewline -ForegroundColor Cyan
Write-Host ("="*69) -ForegroundColor Cyan
Write-Host "  Setting up Spark Environment with Python 3.11" -ForegroundColor Yellow
Write-Host "=" -NoNewline -ForegroundColor Cyan
Write-Host ("="*69) -ForegroundColor Cyan

# Check if conda is available
Write-Host "`n[1/5] Checking for Anaconda/Miniconda..." -ForegroundColor Green

try {
    $condaVersion = conda --version 2>$null
    if ($condaVersion) {
        Write-Host "   ✓ Conda found: $condaVersion" -ForegroundColor Green

        # Create environment
        Write-Host "`n[2/5] Creating Python 3.11 environment (spark-env)..." -ForegroundColor Green
        Write-Host "   This may take a few minutes..." -ForegroundColor Yellow
        conda create -n spark-env python=3.11 -y

        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✓ Environment created successfully" -ForegroundColor Green

            # Get conda path
            $condaPath = (conda info --base)
            $activateScript = Join-Path $condaPath "Scripts\activate.bat"

            Write-Host "`n[3/5] Installing required packages..." -ForegroundColor Green
            Write-Host "   Installing: pyspark, findspark, pandas, numpy, matplotlib, seaborn, plotly, textblob, jupyter" -ForegroundColor Yellow

            # Install packages in the new environment
            conda run -n spark-env pip install pyspark==3.5.0 findspark pandas numpy matplotlib seaborn plotly textblob jupyter ipython

            if ($LASTEXITCODE -eq 0) {
                Write-Host "   ✓ All packages installed successfully" -ForegroundColor Green

                Write-Host "`n[4/5] Verifying installation..." -ForegroundColor Green
                $pythonVersion = conda run -n spark-env python --version
                Write-Host "   Python version: $pythonVersion" -ForegroundColor Cyan

                Write-Host "`n[5/5] Setup complete!" -ForegroundColor Green
                Write-Host "`n" -NoNewline
                Write-Host "=" -NoNewline -ForegroundColor Cyan
                Write-Host ("="*69) -ForegroundColor Cyan
                Write-Host "  🎉 SUCCESS! Spark environment is ready" -ForegroundColor Green
                Write-Host "=" -NoNewline -ForegroundColor Cyan
                Write-Host ("="*69) -ForegroundColor Cyan

                Write-Host "`n📋 NEXT STEPS:" -ForegroundColor Yellow
                Write-Host "`n1. Activate the environment:" -ForegroundColor White
                Write-Host "   conda activate spark-env" -ForegroundColor Cyan

                Write-Host "`n2. Start Jupyter Notebook:" -ForegroundColor White
                Write-Host "   jupyter notebook" -ForegroundColor Cyan

                Write-Host "`n3. In Jupyter, open: prototype-colab-dataset-analysis.ipynb" -ForegroundColor White

                Write-Host "`n4. Run the cells and Spark jobs will work!" -ForegroundColor White

                Write-Host "`n💡 TIP: To activate this environment in the future:" -ForegroundColor Yellow
                Write-Host "   conda activate spark-env" -ForegroundColor Cyan

                Write-Host "`n" -NoNewline
                Write-Host "=" -NoNewline -ForegroundColor Cyan
                Write-Host ("="*69) -ForegroundColor Cyan

                # Offer to start Jupyter immediately
                Write-Host "`n"
                $response = Read-Host "Would you like to start Jupyter Notebook now? (y/n)"
                if ($response -eq 'y' -or $response -eq 'Y') {
                    Write-Host "`n🚀 Starting Jupyter Notebook in spark-env..." -ForegroundColor Green
                    conda activate spark-env
                    jupyter notebook
                }
            } else {
                Write-Host "   ✗ Package installation failed" -ForegroundColor Red
                Write-Host "   Try manually: conda activate spark-env; pip install pyspark findspark pandas numpy matplotlib seaborn plotly textblob jupyter" -ForegroundColor Yellow
            }
        } else {
            Write-Host "   ✗ Environment creation failed" -ForegroundColor Red
            Write-Host "   You may already have this environment. Try: conda activate spark-env" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "   ✗ Conda not found" -ForegroundColor Red
    Write-Host "`n   Anaconda/Miniconda is not installed or not in PATH" -ForegroundColor Yellow
    Write-Host "`n   📥 Please install Anaconda from:" -ForegroundColor Yellow
    Write-Host "   https://www.anaconda.com/products/distribution" -ForegroundColor Cyan
    Write-Host "`n   Or install Miniconda (lighter) from:" -ForegroundColor Yellow
    Write-Host "   https://docs.conda.io/en/latest/miniconda.html" -ForegroundColor Cyan
    Write-Host "`n   After installation, run this script again." -ForegroundColor Yellow
}

Write-Host "`n"
