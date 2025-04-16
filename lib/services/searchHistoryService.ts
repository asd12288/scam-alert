import { createClient } from "@/lib/supabase";

interface SearchData {
  domain: string;
  score: number;
  details: {
    safeBrowsing?: {
      isMalicious?: boolean;
    };
    whois?: {
      data?: {
        domainAge?: number;
      };
    };
    ssl?: {
      valid: boolean;
    };
    // Other security details
    [key: string]: any;
  };
  aiSummary?: string;
  analysisDate?: string;
  screenshot?: string; // Base64 encoded screenshot
}

/**
 * Save domain search history to Supabase
 * If userId is provided, the search will be associated with that user
 */
export async function saveDomainSearch(
  data: SearchData,
  userId?: string
): Promise<boolean> {
  try {
    // Initialize Supabase client
    const supabase = createClient();

    // Extract key data points for quick access in queries
    const {
      domain,
      score,
      details: { safeBrowsing, whois, ssl },
      aiSummary,
      analysisDate,
      screenshot,
    } = data;

    const normalizedDomain = domain.toLowerCase().trim();

    // 1. First update the domain_stats table (create or update)
    const { data: existingStats, error: statsQueryError } = await supabase
      .from("domain_stats")
      .select("id, search_count, screenshot")
      .eq("domain", normalizedDomain)
      .limit(1);

    if (statsQueryError) {
      console.error("Error checking domain stats:", statsQueryError);
      return false;
    }

    // If domain exists in stats table, update it
    if (existingStats && existingStats.length > 0) {
      const {
        id,
        search_count,
        screenshot: existingScreenshot,
      } = existingStats[0];
      const newSearchCount = search_count ? search_count + 1 : 2;

      // Only update with new screenshot if the current one doesn't exist
      const screenshotToUse = existingScreenshot || screenshot;

      const { error: updateError } = await supabase
        .from("domain_stats")
        .update({
          last_score: score,
          is_malicious: safeBrowsing?.isMalicious || false,
          ssl_valid: ssl?.valid,
          domain_age: whois?.data?.domainAge,
          search_count: newSearchCount,
          screenshot: screenshotToUse,
          last_search_data: {
            details: data.details,
            aiSummary,
            analysisDate: analysisDate || new Date().toISOString(),
          },
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (updateError) {
        console.error("Error updating domain stats:", updateError);
        // Continue anyway to try saving the user search
      }
    } else {
      // If domain doesn't exist in stats table, insert new record
      const { error: insertError } = await supabase
        .from("domain_stats")
        .insert({
          domain: normalizedDomain,
          search_count: 1,
          last_score: score,
          is_malicious: safeBrowsing?.isMalicious || false,
          ssl_valid: ssl?.valid,
          domain_age: whois?.data?.domainAge,
          screenshot,
          last_search_data: {
            details: data.details,
            aiSummary,
            analysisDate: analysisDate || new Date().toISOString(),
          },
        });

      if (insertError) {
        console.error("Error saving domain stats:", insertError);
        // Continue anyway to try saving the user search
      }
    }

    // 2. Always insert a new record in domain_searches for user history
    // Only add user_id if provided, otherwise it's an anonymous search
    const { error: searchError } = await supabase
      .from("domain_searches")
      .insert({
        user_id: userId || null,
        domain: normalizedDomain,
        score,
        is_malicious: safeBrowsing?.isMalicious || false,
        ssl_valid: ssl?.valid,
        domain_age: whois?.data?.domainAge,
        search_count: 1, // Always 1 for individual searches
        screenshot, // Still store screenshot per search
        search_data: {
          details: data.details,
          aiSummary,
          analysisDate: analysisDate || new Date().toISOString(),
        },
      });

    if (searchError) {
      console.error("Error saving domain search:", searchError);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to save domain search:", error);
    return false;
  }
}

/**
 * Get a recent search for a domain (not older than specified days)
 * @param domain Domain name to search for
 * @param maxAgeDays Maximum age of search in days (default 14 days)
 * @returns The most recent search data or null if none found
 */
export async function getRecentDomainSearch(
  domain: string,
  maxAgeDays = 14
): Promise<any | null> {
  try {
    const supabase = createClient();
    const normalizedDomain = domain.toLowerCase().trim();

    // Calculate the date threshold (current date minus maxAgeDays)
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - maxAgeDays);

    // First check the domain_stats table for the most recent data
    const { data, error } = await supabase
      .from("domain_stats")
      .select("*")
      .eq("domain", normalizedDomain)
      .limit(1);

    if (error) {
      console.error("Error retrieving recent search:", error);
      return null;
    }

    // If found in domain_stats and recently updated, return it
    if (data && data.length > 0) {
      const statsRecord = data[0];
      const updatedAt = new Date(statsRecord.updated_at);

      if (updatedAt >= dateThreshold) {
        return {
          ...statsRecord,
          score: statsRecord.last_score, // Map last_score to score in the returned object
          search_data: statsRecord.last_search_data,
        };
      }
    }

    // If not found in stats or too old, check domain_searches as fallback
    const { data: searchesData, error: searchesError } = await supabase
      .from("domain_searches")
      .select("*")
      .eq("domain", normalizedDomain)
      .gte("created_at", dateThreshold.toISOString())
      .order("created_at", { ascending: false })
      .limit(1);

    if (searchesError) {
      console.error("Error retrieving from domain_searches:", searchesError);
      return null;
    }

    // Return the most recent search or null if none found
    return searchesData && searchesData.length > 0 ? searchesData[0] : null;
  } catch (error) {
    console.error("Failed to get recent domain search:", error);
    return null;
  }
}

/**
 * Get search history for a user
 * Returns most recent searches first
 */
export async function getUserSearchHistory(
  userId: string,
  limit = 10
): Promise<any[]> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("domain_searches")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching user search history:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Failed to get user search history:", error);
    return [];
  }
}

/**
 * Get trending domains being searched (anonymized data)
 */
export async function getTrendingSearches(days = 7, limit = 5): Promise<any[]> {
  try {
    const supabase = createClient();

    // Use domain_stats for trending searches instead of RPC function
    const { data, error } = await supabase
      .from("domain_stats")
      .select("domain, last_score, is_malicious, search_count, updated_at")
      .gte(
        "updated_at",
        new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
      )
      .order("search_count", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching trending searches:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Failed to get trending searches:", error);
    return [];
  }
}

/**
 * Get the search count for a specific domain
 */
export async function getDomainSearchCount(domain: string): Promise<number> {
  try {
    const supabase = createClient();
    const normalizedDomain = domain.toLowerCase().trim();

    // Use domain_stats table for search counts
    const { data, error } = await supabase
      .from("domain_stats")
      .select("search_count")
      .eq("domain", normalizedDomain);

    if (error) {
      console.error("Error retrieving domain search count:", error);
      return 0;
    }

    // Return the search count if found, otherwise return 0
    return data && data.length > 0 ? data[0].search_count : 0;
  } catch (error) {
    console.error("Failed to get domain search count:", error);
    return 0;
  }
}

/**
 * Get the most frequently searched domains
 */
export async function getMostSearchedDomains(limit = 10): Promise<any[]> {
  try {
    const supabase = createClient();

    // Use domain_stats table for most searched domains
    const { data, error } = await supabase
      .from("domain_stats")
      .select(
        "domain, last_score as score, is_malicious, search_count, updated_at"
      )
      .order("search_count", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error retrieving most searched domains:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Failed to get most searched domains:", error);
    return [];
  }
}

/**
 * Get the screenshot for a domain if it exists
 */
export async function getDomainScreenshot(
  domain: string
): Promise<string | null> {
  try {
    const supabase = createClient();
    const normalizedDomain = domain.toLowerCase().trim();

    // Use domain_stats table for screenshots
    const { data, error } = await supabase
      .from("domain_stats")
      .select("screenshot")
      .eq("domain", normalizedDomain);

    if (error || !data || data.length === 0) {
      console.error("Error retrieving domain screenshot:", error);
      return null;
    }

    return data[0].screenshot;
  } catch (error) {
    console.error("Failed to get domain screenshot:", error);
    return null;
  }
}
