-- Create a settings table for storing application configurations
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default scoring weights
INSERT INTO system_settings (key, value, description)
VALUES (
  'scoring_weights',
  '{
    "safeBrowsing": 30,
    "domainAge": 20,
    "ssl": 15,
    "dns": 15,
    "patternAnalysis": 20,
    "baselineScore": 70
  }',
  'Weights used in the domain security scoring algorithm'
);

-- Insert default risk factor penalties
INSERT INTO system_settings (key, value, description)
VALUES (
  'risk_factor_penalties',
  '{
    "manyRiskFactors": 8,
    "severalRiskFactors": 4,
    "privacyProtection": 2,
    "whoisError": 3
  }',
  'Penalty values for various risk factors in security scoring'
);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update timestamp on settings updates
CREATE TRIGGER update_system_settings_timestamp
BEFORE UPDATE ON system_settings
FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();