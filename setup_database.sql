-- Database Setup Script for Sentiment Analysis Project
-- Run this script after connecting as postgres superuser

-- Create the database
CREATE DATABASE sentiment_analysis;

-- Create the user
CREATE USER sentiment_user WITH PASSWORD 'sentiment_pass_2024';

-- Grant database privileges
GRANT ALL PRIVILEGES ON DATABASE sentiment_analysis TO sentiment_user;

-- Connect to the new database
\c sentiment_analysis

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO sentiment_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO sentiment_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO sentiment_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO sentiment_user;

-- Verify the setup
SELECT 'Database setup completed successfully!' as status;

-- Show current database and user
SELECT current_database(), current_user;

-- Exit
\q
