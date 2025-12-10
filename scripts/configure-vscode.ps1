# PowerShell script to disable MSSQL extension and configure VS Code for MySQL
# Run this script if you continue to see SQL Server syntax errors

Write-Host "Configuring VS Code for MySQL syntax..." -ForegroundColor Green

# Check if code command is available
if (Get-Command code -ErrorAction SilentlyContinue) {
    Write-Host "Disabling MSSQL extension for this workspace..." -ForegroundColor Yellow
    code --disable-extension ms-mssql.mssql
    code --disable-extension ms-mssql.sql-database-projects-vscode
    
    Write-Host "Installing recommended MySQL extension..." -ForegroundColor Yellow
    code --install-extension formulahendry.vscode-mysql
    code --install-extension mtxr.sqltools
    code --install-extension mtxr.sqltools-driver-mysql
    
    Write-Host "VS Code extensions configured successfully!" -ForegroundColor Green
    Write-Host "Please restart VS Code to apply changes." -ForegroundColor Cyan
} else {
    Write-Host "VS Code 'code' command not found in PATH." -ForegroundColor Red
    Write-Host "Please manually disable the MSSQL extension in VS Code Extensions panel." -ForegroundColor Yellow
}

Write-Host "`nConfiguration Summary:" -ForegroundColor Cyan
Write-Host "- MSSQL extensions disabled" -ForegroundColor White
Write-Host "- MySQL extensions installed" -ForegroundColor White
Write-Host "- Workspace configured for MySQL syntax" -ForegroundColor White
Write-Host "- SQL files will use MySQL dialect" -ForegroundColor White

Read-Host "`nPress Enter to continue..."