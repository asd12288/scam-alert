-- Create a separate table to store domain statistics
CREATE TABLE IF NOT EXISTS domain_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain TEXT NOT NULL UNIQUE,
    search_count INTEGER DEFAULT 1,
    last_score INTEGER,
    is_malicious BOOLEAN DEFAULT FALSE,
    ssl_valid BOOLEAN,
    domain_age INTEGER,
    screenshot TEXT,
    last_search_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_domain_stats_domain ON domain_stats(domain);
CREATE INDEX IF NOT EXISTS idx_domain_stats_search_count ON domain_stats(search_count);

-- No row level security needed as this is aggregate public data