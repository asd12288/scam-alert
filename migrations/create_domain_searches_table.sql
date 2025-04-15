-- Create a table to store user domain search history
CREATE TABLE IF NOT EXISTS domain_searches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    domain TEXT NOT NULL,
    score INTEGER NOT NULL,
    is_malicious BOOLEAN DEFAULT FALSE,
    ssl_valid BOOLEAN,
    domain_age INTEGER,
    search_count INTEGER DEFAULT 1,
    screenshot TEXT,
    search_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    -- Add indexes for performance
    CONSTRAINT valid_domain CHECK (length(domain) > 0)
);

-- Add indexes for frequent query patterns
CREATE INDEX IF NOT EXISTS idx_domain_searches_user_id ON domain_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_domain_searches_domain ON domain_searches(domain);
CREATE INDEX IF NOT EXISTS idx_domain_searches_created_at ON domain_searches(created_at);

-- Add row level security policies
ALTER TABLE domain_searches ENABLE ROW LEVEL SECURITY;

-- Allow users to view only their own searches
CREATE POLICY "Users can view own searches" 
    ON domain_searches FOR SELECT 
    USING (auth.uid() = user_id);

-- Allow the service role to insert records for any user
CREATE POLICY "Service can insert records" 
    ON domain_searches FOR INSERT 
    WITH CHECK (true);
    
-- Allow service role to update search counts
CREATE POLICY "Service can update search counts"
    ON domain_searches FOR UPDATE
    USING (true);