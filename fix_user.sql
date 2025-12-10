-- Fix user creation script
-- Run this if the user authentication failed

-- Drop the user if it exists (to start fresh)
DROP USER IF EXISTS sentiment_user;

-- Create the user again with the correct password
CREATE USER sentiment_user WITH PASSWORD 'sentiment_pass_2024';

-- Grant database privileges
GRANT ALL PRIVILEGES ON DATABASE sentiment_analysis TO sentiment_user;

-- Connect to the database
\c sentiment_analysis

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO sentiment_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO sentiment_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO sentiment_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO sentiment_user;

-- Also grant default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO sentiment_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO sentiment_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO sentiment_user;

-- Verify
SELECT 'User recreated successfully!' as status;
