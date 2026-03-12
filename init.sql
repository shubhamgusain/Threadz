-- Threadz Database Initialization Script
-- This script is run when the PostgreSQL container starts for the first time

-- Create the database if it doesn't exist
-- Note: This script runs with the default postgres database
-- The actual threadz database is created by the environment variables

-- Create extensions that might be needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom types if needed
DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Grant permissions to the threadz_user
GRANT ALL PRIVILEGES ON DATABASE threadz TO threadz_user;

-- Connect to the threadz database and set up schema
\c threadz;

-- Create schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS public;

-- Grant permissions on schema
GRANT ALL ON SCHEMA public TO threadz_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO threadz_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO threadz_user;

-- Set default permissions for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO threadz_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO threadz_user;
