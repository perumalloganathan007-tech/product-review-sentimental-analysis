-- Migration script to add analysis_history table
-- Run this script to add history functionality to your existing database

-- Analysis History Table for tracking user analysis sessions
CREATE TABLE IF NOT EXISTS analysis_history (
    id BIGSERIAL PRIMARY KEY,
    category VARCHAR(20) NOT NULL CHECK (category IN ('dataset', 'compare', 'multi-compare', 'dataset-product')),
    title VARCHAR(500) NOT NULL,

    -- Store analysis data as JSONB for flexibility
    analysis_data JSONB NOT NULL DEFAULT '{}',
    summary_data JSONB NOT NULL DEFAULT '{}',

    -- Analysis metrics
    items_analyzed INTEGER NOT NULL DEFAULT 0,
    processing_time_ms INTEGER,
    status VARCHAR(20) NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'failed', 'processing')),

    -- User session tracking (can be extended for multi-user support)
    session_id VARCHAR(100),
    user_agent TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for history queries
CREATE INDEX IF NOT EXISTS idx_history_category ON analysis_history(category);
CREATE INDEX IF NOT EXISTS idx_history_created_at ON analysis_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_history_status ON analysis_history(status);
CREATE INDEX IF NOT EXISTS idx_history_session ON analysis_history(session_id);

-- JSONB indexes for flexible querying
CREATE INDEX IF NOT EXISTS idx_history_analysis_data ON analysis_history USING GIN(analysis_data);
CREATE INDEX IF NOT EXISTS idx_history_summary_data ON analysis_history USING GIN(summary_data);

-- Full-text search on title
CREATE INDEX IF NOT EXISTS idx_history_title_search ON analysis_history USING GIN(to_tsvector('english', title));

-- Auto-update trigger for history (reuse existing function)
DROP TRIGGER IF EXISTS update_history_updated_at ON analysis_history;
CREATE TRIGGER update_history_updated_at BEFORE UPDATE ON analysis_history
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional, remove if not needed)
INSERT INTO analysis_history (category, title, analysis_data, summary_data, items_analyzed, session_id)
VALUES
    ('dataset', 'Sample URLs Dataset Analysis (5 URLs)',
     '{"totalUrls": 5, "overallSentiment": "POSITIVE"}',
     '{"itemsAnalyzed": 5, "sentimentScore": "POSITIVE", "processingTime": "2.1s", "status": "Completed"}',
     5, 'sample-session-1'),
    ('compare', 'Compare: iPhone 13 vs Samsung Galaxy S21',
     '{"product1": {"title": "iPhone 13"}, "product2": {"title": "Samsung Galaxy S21"}, "winner": "iPhone 13"}',
     '{"itemsAnalyzed": 2, "sentimentScore": "iPhone 13", "processingTime": "1.8s", "status": "Completed"}',
     2, 'sample-session-1')
ON CONFLICT DO NOTHING;

-- Verify the table was created
SELECT 'analysis_history table created successfully' AS status;
SELECT COUNT(*) as total_records FROM analysis_history;
