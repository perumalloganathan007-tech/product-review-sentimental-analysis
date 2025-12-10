-- Complete Database Reset Script
-- WARNING: This script will DELETE ALL DATA in the sentiment analysis database
-- Use this script only if you want to completely reset and clean the database

-- Connect to the database
\c sentiment_analysis

BEGIN;

-- Show current record counts before reset
SELECT 'BEFORE RESET - ALL DATA WILL BE DELETED:' as warning;
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
FROM comparisons
UNION ALL
SELECT
    'Comparison Analyses' as table_name, COUNT(*) as record_count
FROM comparison_analyses;

-- ============================================
-- COMPLETE DATA RESET - DELETE ALL RECORDS
-- ============================================

-- Delete in order respecting foreign key constraints
DELETE FROM comparison_analyses;
DELETE FROM comparisons;
DELETE FROM reviews;
DELETE FROM analyses;
DELETE FROM products;
DELETE FROM analysis_history;

-- Reset all sequences to start from 1
SELECT setval('products_id_seq', 1, false);
SELECT setval('analyses_id_seq', 1, false);
SELECT setval('reviews_id_seq', 1, false);
SELECT setval('analysis_history_id_seq', 1, false);
SELECT setval('comparisons_id_seq', 1, false);
SELECT setval('comparison_analyses_id_seq', 1, false);

-- Verify all tables are empty
SELECT 'AFTER RESET - VERIFICATION:' as status;
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
FROM comparisons
UNION ALL
SELECT
    'Comparison Analyses' as table_name, COUNT(*) as record_count
FROM comparison_analyses;

-- Optimize database after cleanup
VACUUM FULL ANALYZE products;
VACUUM FULL ANALYZE analyses;
VACUUM FULL ANALYZE reviews;
VACUUM FULL ANALYZE analysis_history;
VACUUM FULL ANALYZE comparisons;
VACUUM FULL ANALYZE comparison_analyses;

-- Reindex all tables for optimal performance
REINDEX TABLE products;
REINDEX TABLE analyses;
REINDEX TABLE reviews;
REINDEX TABLE analysis_history;
REINDEX TABLE comparisons;
REINDEX TABLE comparison_analyses;

SELECT 'Complete database reset completed successfully!' as status;
SELECT 'All historical data has been removed and database optimized.' as message;

COMMIT;
