-- PostgreSQL Schema for Sentiment Analysis NLP
-- Enhanced with full-text search, JSONB support, and analytics features

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(500),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE analyses (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    -- Enhanced input_type with PostgreSQL CHECK constraint
    input_type VARCHAR(10) NOT NULL CHECK (input_type IN ('DATASET', 'URL')),
    preprocessing_status BOOLEAN NOT NULL DEFAULT FALSE,

    -- JSONB for flexible sentiment data storage
    sentiment_counts JSONB NOT NULL DEFAULT '{"positive": 0, "neutral": 0, "negative": 0}',
    percentages JSONB NOT NULL DEFAULT '{"positive": 0.0, "neutral": 0.0, "negative": 0.0}',

    -- Traditional columns for compatibility
    positive_count INTEGER NOT NULL DEFAULT 0,
    neutral_count INTEGER NOT NULL DEFAULT 0,
    negative_count INTEGER NOT NULL DEFAULT 0,
    total_reviews INTEGER NOT NULL DEFAULT 0,
    positive_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    neutral_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    negative_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,

    overall_sentiment VARCHAR(10) NOT NULL CHECK (overall_sentiment IN ('POSITIVE', 'NEUTRAL', 'NEGATIVE')),
    overall_suggestion TEXT,

    -- ML model tracking
    ml_model_version VARCHAR(50) DEFAULT 'stanford-corenlp-4.5.4',
    confidence_score DECIMAL(3,2),
    processing_time_ms INTEGER,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    analysis_id BIGINT NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
    review_text TEXT NOT NULL,
    sentiment VARCHAR(10) NOT NULL CHECK (sentiment IN ('POSITIVE', 'NEUTRAL', 'NEGATIVE')),
    sentiment_score DECIMAL(3,2) NOT NULL,
    confidence_score DECIMAL(3,2),

    -- Enhanced features for analysis
    word_count INTEGER,
    language VARCHAR(10) DEFAULT 'en',
    source_url VARCHAR(500),
    extracted_keywords JSONB DEFAULT '[]',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comparisons (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    best_product_id BIGINT REFERENCES products(id),
    comparison_metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comparison_analyses (
    id BIGSERIAL PRIMARY KEY,
    comparison_id BIGINT NOT NULL REFERENCES comparisons(id) ON DELETE CASCADE,
    analysis_id BIGINT NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
    rank_position INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Ensure unique combination
    UNIQUE(comparison_id, analysis_id)
);

-- Performance Indexes
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_analyses_product_sentiment ON analyses(product_id, overall_sentiment);
CREATE INDEX idx_analyses_created_at ON analyses(created_at);
CREATE INDEX idx_reviews_sentiment_score ON reviews(sentiment, sentiment_score);
CREATE INDEX idx_reviews_analysis_id ON reviews(analysis_id);
CREATE INDEX idx_comparison_analyses_comparison_id ON comparison_analyses(comparison_id);

-- Full-text search index for reviews
CREATE INDEX idx_reviews_text_search ON reviews USING GIN(to_tsvector('english', review_text));

-- JSONB indexes for metadata queries
CREATE INDEX idx_products_metadata ON products USING GIN(metadata);
CREATE INDEX idx_analyses_sentiment_counts ON analyses USING GIN(sentiment_counts);
CREATE INDEX idx_reviews_keywords ON reviews USING GIN(extracted_keywords);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analyses_updated_at BEFORE UPDATE ON analyses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comparisons_updated_at BEFORE UPDATE ON comparisons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Analysis History Table for tracking user analysis sessions
CREATE TABLE analysis_history (
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
CREATE INDEX idx_history_category ON analysis_history(category);
CREATE INDEX idx_history_created_at ON analysis_history(created_at DESC);
CREATE INDEX idx_history_status ON analysis_history(status);
CREATE INDEX idx_history_session ON analysis_history(session_id);

-- JSONB indexes for flexible querying
CREATE INDEX idx_history_analysis_data ON analysis_history USING GIN(analysis_data);
CREATE INDEX idx_history_summary_data ON analysis_history USING GIN(summary_data);

-- Full-text search on title
CREATE INDEX idx_history_title_search ON analysis_history USING GIN(to_tsvector('english', title));

-- Auto-update trigger for history
CREATE TRIGGER update_history_updated_at BEFORE UPDATE ON analysis_history
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
