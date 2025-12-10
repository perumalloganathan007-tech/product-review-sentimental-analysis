# Database Connection Test and Setup

## Step 1: Start PostgreSQL Service (if not running)
```powershell
# Check service status
Get-Service postgresql*

# Start service if stopped
Start-Service postgresql-x64-16  # Adjust version number if different
```

## Step 2: Test Basic Connection
```powershell
# Test connection with sentiment_user
psql -U sentiment_user -d sentiment_analysis -h localhost
```

Expected output:

```text
psql (16.0)
Type "help" for help.

sentiment_analysis=>
```

## Step 3: Verify Database Setup
```sql
-- Check if database exists and is accessible
\dt

-- Should show empty since no tables created yet
-- (Tables will be created by Play Framework evolutions)

-- Check user permissions
\du

-- Exit PostgreSQL
\q
```

## Step 4: Test Play Framework Connection

### Start SBT Console
```powershell
cd "d:\scala project"
sbt
```

### Compile and Check Dependencies
```scala
// In SBT console
compile

// Check if PostgreSQL driver loads
runMain play.api.test.Helpers.running
```

### Run Database Evolutions
```scala
// This will apply the 1.sql evolution script
run
```

Expected behavior:
1. Play Framework starts
2. Connects to PostgreSQL
3. Applies evolution script (creates tables)
4. Shows "Database 'default' is up to date" or similar message

## Step 5: Verify Tables Created

### Connect to PostgreSQL
```powershell
psql -U sentiment_user -d sentiment_analysis -h localhost
```

### Check Tables
```sql
-- List all tables
\dt

-- Expected tables:
-- products, analyses, reviews, comparisons, comparison_analyses, play_evolutions

-- Check table structure
\d products
\d analyses
\d reviews

-- Check indexes
\di

-- Exit
\q
```

## Step 6: Test CRUD Operations

### Insert Test Data
```sql
-- Connect to database
psql -U sentiment_user -d sentiment_analysis -h localhost

-- Insert test product
INSERT INTO products (name, url, metadata) 
VALUES ('Test Product', 'https://example.com', '{"category": "electronics"}');

-- Verify insertion
SELECT * FROM products;

-- Clean up test data
DELETE FROM products WHERE name = 'Test Product';
```

## Troubleshooting Common Issues

### Issue: Connection Refused
```powershell
# Check if PostgreSQL is running
Get-Service postgresql*

# Check if port 5432 is open
netstat -an | findstr 5432

# Restart PostgreSQL service
Restart-Service postgresql-x64-16
```

### Issue: Authentication Failed
```sql
-- Reset password (connect as postgres superuser)
psql -U postgres -h localhost
ALTER USER sentiment_user WITH PASSWORD 'sentiment_pass_2024';
\q
```

### Issue: Database Not Found
```sql
-- Recreate database (connect as postgres)
psql -U postgres -h localhost
DROP DATABASE IF EXISTS sentiment_analysis;
CREATE DATABASE sentiment_analysis;
GRANT ALL PRIVILEGES ON DATABASE sentiment_analysis TO sentiment_user;
\q
```

### Issue: Play Framework Evolution Errors
```powershell
# Clear evolutions and restart
cd "d:\scala project"
sbt clean
sbt compile
sbt run
```

### Issue: Permission Denied
```sql
-- Grant additional permissions (connect as postgres)
psql -U postgres -d sentiment_analysis -h localhost
GRANT ALL ON SCHEMA public TO sentiment_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO sentiment_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO sentiment_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO sentiment_user;
\q
```

## Performance Verification

### Check Connection Pool
```sql
-- Monitor active connections
SELECT count(*) as active_connections 
FROM pg_stat_activity 
WHERE datname = 'sentiment_analysis';

-- Check if HikariCP pool is working
SELECT 
    datname,
    usename,
    application_name,
    state,
    query_start
FROM pg_stat_activity 
WHERE datname = 'sentiment_analysis';
```

### Test Full-Text Search
```sql
-- Insert sample review for testing
INSERT INTO products (name, url) VALUES ('Sample Product', 'https://example.com');
INSERT INTO analyses (product_id, input_type, total_reviews) VALUES (1, 'DATASET', 1);
INSERT INTO reviews (analysis_id, review_text, sentiment, sentiment_score) 
VALUES (1, 'This product is amazing and works perfectly!', 'POSITIVE', 0.95);

-- Test full-text search
SELECT * FROM reviews 
WHERE to_tsvector('english', review_text) @@ to_tsquery('english', 'amazing');

-- Clean up
DELETE FROM reviews WHERE id = 1;
DELETE FROM analyses WHERE id = 1;
DELETE FROM products WHERE id = 1;
```

## Success Indicators
✅ PostgreSQL service running
✅ Can connect with sentiment_user
✅ Play Framework starts without errors
✅ Evolution script applies successfully
✅ All tables created with proper indexes
✅ Can insert/query data
✅ Full-text search working
✅ Connection pooling active

Your database setup is complete when all these indicators are green!
