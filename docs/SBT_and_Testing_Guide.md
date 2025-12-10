# SBT Installation and Database Testing Guide

## Install SBT (Scala Build Tool)

### Option 1: Using Chocolatey (Recommended)
```powershell
# Install Chocolatey if not already installed
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install SBT
choco install sbt
```

### Option 2: Manual Installation

1. Download SBT from: <https://www.scala-sbt.org/download.html>
2. Download the Windows MSI installer
3. Run the installer as Administrator
4. Add SBT to PATH: `C:\Program Files (x86)\sbt\bin`

### Option 3: Using Scoop
```powershell
scoop install sbt
```

## Verify SBT Installation
```powershell
sbt --version
```

Expected output: `sbt version in this project: X.X.X`

## Test Database Connection

### Step 1: Start PostgreSQL and Create Database
```powershell
# Ensure PostgreSQL is running
Get-Service postgresql*

# Connect as postgres user to create database and user
psql -U postgres -h localhost
```

```sql
-- Create database and user (if not already done)
CREATE DATABASE sentiment_analysis;
CREATE USER sentiment_user WITH PASSWORD 'sentiment_pass_2024';
GRANT ALL PRIVILEGES ON DATABASE sentiment_analysis TO sentiment_user;

-- Connect to the new database
\c sentiment_analysis

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO sentiment_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO sentiment_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO sentiment_user;

\q
```

### Step 2: Test Connection with Application User
```powershell
psql -U sentiment_user -d sentiment_analysis -h localhost
```

```sql
-- Test basic operations
SELECT version();
SELECT current_database();
SELECT current_user;

-- Exit
\q
```

### Step 3: Compile and Run Scala Project
```powershell
cd "d:\scala project"

# Download dependencies and compile
sbt compile

# Run the application (this will apply database evolutions)
sbt run
```

### Step 4: Verify Database Tables Created
```powershell
# Connect to database
psql -U sentiment_user -d sentiment_analysis -h localhost
```

```sql
-- Check if evolution was successful
SELECT * FROM play_evolutions;

-- List all tables
\dt

-- Expected tables:
-- products, analyses, reviews, comparisons, comparison_analyses

-- Check table structure
\d products

-- Test full-text search capability
SELECT 'Database setup complete!'::text as status;

\q
```

## Alternative Test Without SBT

If SBT installation is problematic, you can test the database setup independently:

### Manual Table Creation Test
```sql
-- Connect to database
psql -U sentiment_user -d sentiment_analysis -h localhost

-- Manually create a simple test table
CREATE TABLE test_connection (
    id BIGSERIAL PRIMARY KEY,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert test data
INSERT INTO test_connection (message) VALUES ('PostgreSQL connection working!');

-- Query test data
SELECT * FROM test_connection;

-- Clean up
DROP TABLE test_connection;

\q
```

## Environment Setup Summary

After completing these steps, you should have:

1. ✅ PostgreSQL 15/16 installed and running
2. ✅ Database `sentiment_analysis` created
3. ✅ User `sentiment_user` with proper permissions
4. ✅ SBT installed and working
5. ✅ Project dependencies updated for PostgreSQL
6. ✅ Connection configuration in application.conf
7. ✅ Evolution script ready for PostgreSQL

## Next Steps for Development

1. **Start Play Framework**: `sbt run`
2. **Access application**: <http://localhost:9000>
3. **Check evolution status**: Play will show evolution page on first run
4. **Apply evolutions**: Click "Apply this script now!"
5. **Verify tables**: Use pgAdmin or psql to check tables
6. **Begin development**: Start implementing controllers and services

## Troubleshooting SBT Issues### Issue: SBT command not found
```powershell
# Check if SBT is in PATH
$env:PATH -split ';' | Where-Object { $_ -like '*sbt*' }

# Manually add to PATH for current session
$env:PATH += ";C:\Program Files (x86)\sbt\bin"
```

### Issue: Java not found
```powershell
# Install Java 11 or higher
choco install openjdk11

# Or install Java 17 (recommended for Scala 2.13)
choco install openjdk17
```

### Issue: SBT downloading forever
```powershell
# Clear SBT cache
Remove-Item -Recurse -Force "$HOME\.sbt"
Remove-Item -Recurse -Force "$HOME\.ivy2"

# Try again
sbt clean compile
```

Your PostgreSQL database is now ready for the Scala Play Framework sentiment analysis application!
