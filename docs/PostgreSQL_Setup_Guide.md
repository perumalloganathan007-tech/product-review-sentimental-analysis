# PostgreSQL Setup Guide for Sentiment Analysis Project

## Step 1: Install PostgreSQL

### Option A: Download from Official Website (Recommended)
1. Go to [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
2. Download PostgreSQL 15.x or 16.x (latest stable version)
3. Run the installer as Administrator
4. During installation:
   - Choose installation directory (default: `C:\Program Files\PostgreSQL\16`)
   - Set superuser password (remember this!)
   - Keep default port: 5432
   - Select locale: Default locale
   - **Important**: Install pgAdmin 4 (PostgreSQL management tool)
   - **Important**: Install Stack Builder for additional tools

### Option B: Using Chocolatey (if you have it)
```powershell
choco install postgresql --params '/Password:yourpassword'
```

### Option C: Using Scoop
```powershell
scoop install postgresql
```

## Step 2: Verify Installation
Open PowerShell as Administrator and run:
```powershell
# Check if PostgreSQL service is running
Get-Service postgresql*

# Connect to PostgreSQL (will prompt for password)
psql -U postgres -h localhost
```

If successful, you should see:
```text
Expected output:
psql (16.0)
Type "help" for help.

postgres=#
```

## Step 3: Create Database and User

### Connect to PostgreSQL
```sql
-- Connect as superuser
psql -U postgres -h localhost
```

### Create Database and User
```sql
-- Create database for sentiment analysis
CREATE DATABASE sentiment_analysis;

-- Create dedicated user
CREATE USER sentiment_user WITH PASSWORD 'sentiment_pass_2024';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE sentiment_analysis TO sentiment_user;

-- Connect to the new database
\c sentiment_analysis

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO sentiment_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO sentiment_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO sentiment_user;

-- Exit PostgreSQL
\q
```

### Test Connection with New User
```powershell
psql -U sentiment_user -d sentiment_analysis -h localhost
```

## Step 4: Optional - Install Additional Tools

### pgAdmin 4 (GUI Management Tool)
- Should be installed with PostgreSQL
- Access via: Start Menu → PostgreSQL → pgAdmin 4
- Or download separately from [https://www.pgadmin.org/](https://www.pgadmin.org/)

### DBeaver (Alternative GUI Tool)
```powershell
choco install dbeaver
```

## Environment Variables (Optional but Recommended)
Add to Windows PATH:
```text
C:\Program Files\PostgreSQL\16\bin
```

This allows you to run `psql` from any directory.

## Security Considerations
1. Change default postgres password
2. Configure `pg_hba.conf` for specific IP restrictions if needed
3. Enable SSL if accessing from remote machines
4. Regular backups with `pg_dump`

## Troubleshooting
- **Service not starting**: Check Windows Services, restart PostgreSQL service
- **Connection refused**: Verify port 5432 is not blocked by firewall
- **Authentication failed**: Double-check username/password
- **Database not found**: Ensure you created the database correctly
