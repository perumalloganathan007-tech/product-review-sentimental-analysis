# 🚨 SQL Server Syntax Errors - Quick Fix

If you're seeing errors like "Incorrect syntax near 'AUTO_INCREMENT'" or "'DATASET'", these are **false positives** from the SQL Server linter.

## ⚡ Immediate Solutions (Choose One)

### Option 1: Run Configuration Script
```powershell
# In PowerShell terminal, navigate to project directory and run:
.\scripts\configure-vscode.ps1
```

### Option 2: Manual VS Code Fix
1. **Open Extensions Panel** (`Ctrl+Shift+X`)
2. **Search "mssql"** and **DISABLE** any SQL Server extensions
3. **Search "mysql"** and **INSTALL** MySQL extensions
4. **Restart VS Code**

### Option 3: Ignore the Errors
- The SQL syntax is **correct for MySQL**
- The errors are **cosmetic only**
- Your application will work perfectly
- The `conf/application.conf` confirms MySQL configuration

## 📋 Why This Happens

- **Project uses MySQL** (see `conf/application.conf`)
- **VS Code has SQL Server extension active**
- **SQL Server syntax ≠ MySQL syntax**
- **Extensions conflict with each other**

## ✅ How to Verify Fix Worked

After applying any solution:
1. **Open** `conf/evolutions/default/1.sql`
2. **Check status bar** should show "MySQL" (not "SQL Server")
3. **Red underlines should disappear**
4. **File should show proper syntax highlighting**

## 🔍 Technical Details

The selected `input_type` field uses valid MySQL syntax:
```sql
input_type VARCHAR(10) NOT NULL CHECK (input_type IN ('DATASET', 'URL'))
```

This is a **CHECK constraint** that ensures the `input_type` column only accepts either 'DATASET' or 'URL' values - perfectly valid MySQL syntax that SQL Server linter doesn't understand.

---

**Bottom Line:** Your code is correct, the linter is wrong. Apply one of the fixes above to eliminate the false error messages.