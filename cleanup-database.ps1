# Database Cleanup PowerShell Script
# This script connects to PostgreSQL and runs the cleanup SQL scripts

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("cleanup", "reset")]
    [string]$Action = "cleanup",

    [Parameter(Mandatory=$false)]
    [string]$Host = "localhost",

    [Parameter(Mandatory=$false)]
    [int]$Port = 5432,

    [Parameter(Mandatory=$false)]
    [string]$Database = "sentiment_analysis",

    [Parameter(Mandatory=$false)]
    [string]$Username = "sentiment_user"
)

# Colors for output
$Green = "Green"
$Red = "Red"
$Yellow = "Yellow"
$Cyan = "Cyan"

Write-Host "🗄️  Database Cleanup Script for Sentiment Analysis Project" -ForegroundColor $Cyan
Write-Host "============================================" -ForegroundColor $Cyan

# Check if psql is available
try {
    $psqlVersion = & psql --version 2>$null
    Write-Host "✅ PostgreSQL client found: $($psqlVersion)" -ForegroundColor $Green
} catch {
    Write-Host "❌ ERROR: psql command not found!" -ForegroundColor $Red
    Write-Host "Please install PostgreSQL client tools and add them to your PATH" -ForegroundColor $Yellow
    exit 1
}

# Get current directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Write-Host "📂 Script directory: $ScriptDir" -ForegroundColor $Cyan

# Determine which SQL script to run
$SqlScript = ""
switch ($Action) {
    "cleanup" {
        $SqlScript = Join-Path $ScriptDir "cleanup_database.sql"
        Write-Host "🧹 Action: Cleanup old records (30+ days)" -ForegroundColor $Yellow
    }
    "reset" {
        $SqlScript = Join-Path $ScriptDir "reset_database_complete.sql"
        Write-Host "⚠️  Action: COMPLETE DATABASE RESET (ALL DATA WILL BE DELETED!)" -ForegroundColor $Red

        # Confirmation for reset
        $confirmation = Read-Host "Are you sure you want to DELETE ALL DATA? Type 'YES' to continue"
        if ($confirmation -ne "YES") {
            Write-Host "❌ Operation cancelled by user." -ForegroundColor $Yellow
            exit 0
        }
    }
}

# Check if SQL script exists
if (-not (Test-Path $SqlScript)) {
    Write-Host "❌ ERROR: SQL script not found: $SqlScript" -ForegroundColor $Red
    exit 1
}

Write-Host "📄 Using SQL script: $(Split-Path -Leaf $SqlScript)" -ForegroundColor $Cyan

# Build connection parameters
$env:PGPASSWORD = "sentiment_pass_2024"
$connectionParams = @(
    "-h", $Host
    "-p", $Port
    "-U", $Username
    "-d", $Database
    "-f", $SqlScript
)

Write-Host "🔗 Connecting to database..." -ForegroundColor $Cyan
Write-Host "   Host: $Host" -ForegroundColor $Cyan
Write-Host "   Port: $Port" -ForegroundColor $Cyan
Write-Host "   Database: $Database" -ForegroundColor $Cyan
Write-Host "   User: $Username" -ForegroundColor $Cyan

# Execute the SQL script
try {
    Write-Host "🚀 Executing database cleanup..." -ForegroundColor $Yellow
    $result = & psql @connectionParams 2>&1

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database cleanup completed successfully!" -ForegroundColor $Green
        Write-Host "📊 Results:" -ForegroundColor $Cyan
        Write-Host $result -ForegroundColor $Green
    } else {
        Write-Host "❌ Database cleanup failed!" -ForegroundColor $Red
        Write-Host "Error output:" -ForegroundColor $Yellow
        Write-Host $result -ForegroundColor $Red
        exit 1
    }
} catch {
    Write-Host "❌ Error executing database cleanup: $($_.Exception.Message)" -ForegroundColor $Red
    exit 1
} finally {
    # Clear password from environment
    $env:PGPASSWORD = $null
}

Write-Host "🎉 Database maintenance completed!" -ForegroundColor $Green
Write-Host "============================================" -ForegroundColor $Cyan

# Show available options
Write-Host ""
Write-Host "💡 Usage Examples:" -ForegroundColor $Cyan
Write-Host "   .\cleanup-database.ps1 -Action cleanup    # Remove old records (30+ days)" -ForegroundColor $Yellow
Write-Host "   .\cleanup-database.ps1 -Action reset      # Complete database reset (ALL DATA)" -ForegroundColor $Yellow
Write-Host "   .\cleanup-database.ps1 -Host myhost -Port 5433 -Database mydb -Username myuser" -ForegroundColor $Yellow
