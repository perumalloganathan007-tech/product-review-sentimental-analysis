# ⚠️ Disk Space Issue - Solutions

## Problem
Setup failed due to "No space left on device"

## Solutions

### Option 1: Free Up Space (Recommended)

**Check disk space:**
```powershell
Get-PSDrive C | Select-Object Used,Free
```

**Quick space cleanup options:**
1. **Clean temp files:**
```powershell
Remove-Item -Path $env:TEMP\* -Recurse -Force -ErrorAction SilentlyContinue
```

2. **Clean pip cache:**
```powershell
pip cache purge
```

3. **Clean conda cache (if you have Anaconda):**
```cmd
conda clean --all -y
```

4. **Empty Recycle Bin:**
   - Right-click Recycle Bin → Empty

5. **Windows Disk Cleanup:**
   - Press Win+R
   - Type: `cleanmgr`
   - Select C: drive
   - Check all boxes, OK

**Target:** Need ~500MB free space minimum

---

### Option 2: Install to Different Drive

If you have another drive with space (D:, E:, etc.):

```powershell
# Create venv on different drive
py -3.11 -m venv E:\spark-venv

# Activate it
E:\spark-venv\Scripts\activate

# Install packages
pip install pyspark==3.5.0 findspark pandas numpy matplotlib seaborn plotly textblob jupyter
```

---

### Option 3: Use Python 3.11 Without Virtual Environment

**Risky but works if space is critical:**

```powershell
# Install directly to Python 3.11
py -3.11 -m pip install pyspark==3.5.0 findspark jupyter

# Start Jupyter with Python 3.11
py -3.11 -m jupyter notebook
```

⚠️ **Warning:** This installs to system Python, may conflict with other projects

---

### Option 4: Minimal Installation

Install only essential packages:

```powershell
py -3.11 -m venv spark-venv-mini
.\spark-venv-mini\Scripts\activate
pip install pyspark==3.5.0 findspark pandas jupyter
# Skip: matplotlib, seaborn, plotly, textblob
```

You can install visualization packages later if needed.

---

## After Freeing Space

Run setup again:
```powershell
cd "d:\project zip flies\scala project\scala project"
cmd /c setup-python311.bat
```

Or manual setup:
```powershell
py -3.11 -m venv spark-venv
.\spark-venv\Scripts\activate
pip install pyspark==3.5.0 findspark pandas numpy matplotlib seaborn plotly textblob jupyter
```

---

## Check Space Before Installing

```powershell
# Check C: drive space
Get-PSDrive C | Format-Table -AutoSize

# PySpark alone needs ~300MB
# Full install needs ~500MB
```
