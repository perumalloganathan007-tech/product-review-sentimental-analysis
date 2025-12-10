-- Add price and rating columns to products table
-- This migration adds support for storing price and rating information from scraped products

-- Add price column (stores current price as string to handle currency symbols)
ALTER TABLE products ADD COLUMN IF NOT EXISTS price VARCHAR(100);

-- Add original_price column (stores MRP/original price before discount)
ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price VARCHAR(100);

-- Add discount column (stores discount text like "20% off")
ALTER TABLE products ADD COLUMN IF NOT EXISTS discount VARCHAR(50);

-- Add rating column (stores numeric rating, typically 0-5)
ALTER TABLE products ADD COLUMN IF NOT EXISTS rating DOUBLE PRECISION;

-- Add review_count column (stores number of reviews/ratings)
ALTER TABLE products ADD COLUMN IF NOT EXISTS review_count INTEGER;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

-- Add comments to columns
COMMENT ON COLUMN products.price IS 'Current selling price of the product';
COMMENT ON COLUMN products.original_price IS 'Original/MRP price before discount';
COMMENT ON COLUMN products.discount IS 'Discount information (e.g., "20% off")';
COMMENT ON COLUMN products.rating IS 'Product rating (typically 0-5 scale)';
COMMENT ON COLUMN products.review_count IS 'Total number of reviews/ratings';

-- Display success message
SELECT 'Migration completed: Added price and rating columns to products table' AS status;
