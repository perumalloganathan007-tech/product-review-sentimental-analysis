-- Database Cleanup Script for Sentiment Analysis Project
-- This script removes old message records and prescription data from the database
-- Run this script to clean up historical data and free up space

-- Connect to the database
\c sentiment_analysis

BEGIN;

-- Show current record counts before cleanup
SELECT 'BEFORE CLEANUP:' as status;
SELECT
    'Products' as table_name, COUNT(*) as record_count
FROM products
UNION ALL
SELECT
    'Analyses' as table_name, COUNT(*) as record_count
FROM analyses
UNION ALL
SELECT
    'Reviews' as table_name, COUNT(*) as record_count
FROM reviews
UNION ALL
SELECT
    'Analysis History' as table_name, COUNT(*) as record_count
FROM analysis_history
UNION ALL
SELECT
    'Comparisons' as table_name, COUNT(*) as record_count
FROM comparisons;

-- ============================================
-- CLEANUP OLD RECORDS
-- ============================================

-- 1. Remove old analysis history records (older than 30 days)
DELETE FROM analysis_history
WHERE created_at < CURRENT_DATE - INTERVAL '30 days';

-- 2. Remove old reviews data (older than 30 days)
DELETE FROM reviews
WHERE created_at < CURRENT_DATE - INTERVAL '30 days';

-- 3. Remove orphaned analyses (analyses without any reviews)
DELETE FROM analyses
WHERE id NOT IN (SELECT DISTINCT analysis_id FROM reviews WHERE analysis_id IS NOT NULL);

-- 4. Remove old analyses (older than 30 days)
DELETE FROM analyses
WHERE created_at < CURRENT_DATE - INTERVAL '30 days';

-- 5. Remove orphaned products (products without any analyses)
DELETE FROM products
WHERE id NOT IN (SELECT DISTINCT product_id FROM analyses WHERE product_id IS NOT NULL);

-- 6. Remove old comparison data (older than 30 days)
DELETE FROM comparison_analyses
WHERE created_at < CURRENT_DATE - INTERVAL '30 days';

DELETE FROM comparisons
WHERE created_at < CURRENT_DATE - INTERVAL '30 days';

-- 7. Clean up any prescription-related data if it exists
-- (The schema shows this might be healthcare-related based on the screenshot)
-- Remove any test or sample data that might have been inserted
DELETE FROM products WHERE name ILIKE '%prescription%' OR name ILIKE '%test%' OR name ILIKE '%sample%';
DELETE FROM analysis_history WHERE title ILIKE '%prescription%' OR title ILIKE '%test%';

-- ============================================
-- CLEANUP COMPLETE - SHOW RESULTS
-- ============================================

-- Show record counts after cleanup
SELECT 'AFTER CLEANUP:' as status;
SELECT
    'Products' as table_name, COUNT(*) as record_count
FROM products
UNION ALL
SELECT
    'Analyses' as table_name, COUNT(*) as record_count
FROM analyses
UNION ALL
SELECT
    'Reviews' as table_name, COUNT(*) as record_count
FROM reviews
UNION ALL
SELECT
    'Analysis History' as table_name, COUNT(*) as record_count
FROM analysis_history
UNION ALL
SELECT
    'Comparisons' as table_name, COUNT(*) as record_count
FROM comparisons;

-- Reset sequence counters to optimize storage
SELECT setval('products_id_seq', COALESCE(MAX(id), 1), true) FROM products;
SELECT setval('analyses_id_seq', COALESCE(MAX(id), 1), true) FROM analyses;
SELECT setval('reviews_id_seq', COALESCE(MAX(id), 1), true) FROM reviews;
SELECT setval('analysis_history_id_seq', COALESCE(MAX(id), 1), true) FROM analysis_history;
SELECT setval('comparisons_id_seq', COALESCE(MAX(id), 1), true) FROM comparisons;

-- Vacuum and analyze tables for optimal performance
VACUUM ANALYZE products;
VACUUM ANALYZE analyses;
VACUUM ANALYZE reviews;
VACUUM ANALYZE analysis_history;
VACUUM ANALYZE comparisons;
VACUUM ANALYZE comparison_analyses;

SELECT 'Database cleanup completed successfully!' as status;
SELECT 'Old records removed and database optimized.' as message;

COMMIT;
