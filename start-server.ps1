# Sentiment Analysis API Server Starter
# PowerShell Script

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Sentiment Analysis API Server" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting server on http://localhost:9000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to script directory
Set-Location -Path $PSScriptRoot

# Start the server
node mock-server.js
