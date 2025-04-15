-- Function to get trending domains being searched
CREATE OR REPLACE FUNCTION get_trending_domains(days_back int, results_limit int)
RETURNS TABLE (
  domain text,
  search_count bigint,
  avg_score numeric,
  malicious_rate numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ds.domain,
    COUNT(*) as search_count,
    AVG(ds.score)::numeric(10,2) as avg_score,
    (COUNT(*) FILTER (WHERE ds.is_malicious = true)::numeric / COUNT(*)::numeric * 100)::numeric(10,2) as malicious_rate
  FROM 
    domain_searches ds
  WHERE 
    ds.created_at > NOW() - (days_back * INTERVAL '1 day')
  GROUP BY 
    ds.domain
  ORDER BY 
    search_count DESC,
    avg_score ASC
  LIMIT 
    results_limit;
END;
$$;