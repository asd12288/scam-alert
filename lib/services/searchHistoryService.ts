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

    // Check if the domain already exists in the database
    const { data: existingDomain, error: queryError } = await supabase
      .from("domain_searches")
      .select("id, search_count, screenshot")
      .eq("domain", domain.toLowerCase().trim())
      .order("updated_at", { ascending: false })
      .limit(1);

    if (queryError) {
      console.error("Error checking existing domain:", queryError);
      return false;
    }

    // If domain exists, update search_count and other data as needed
    if (existingDomain && existingDomain.length > 0) {
      const {
        id,
        search_count,
        screenshot: existingScreenshot,
      } = existingDomain[0];
      const newSearchCount = search_count ? search_count + 1 : 2;

      // Only update with new screenshot if the current one doesn't exist
      const screenshotToUse = existingScreenshot || screenshot;

      const { error: updateError } = await supabase
        .from("domain_searches")
        .update({
          score,
          is_malicious: safeBrowsing?.isMalicious || false,
          ssl_valid: ssl?.valid,
          domain_age: whois?.data?.domainAge,
          search_count: newSearchCount,
          screenshot: screenshotToUse,
          search_data: {
            details: data.details,
            aiSummary,
            analysisDate: analysisDate || new Date().toISOString(),
          },
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (updateError) {
        console.error("Error updating domain search:", updateError);
        return false;
      }

      return true;
    }

    // If domain doesn't exist, insert new record
    const { error } = await supabase.from("domain_searches").insert({
      user_id: userId || null,
      domain: domain.toLowerCase().trim(),
      score,
      is_malicious: safeBrowsing?.isMalicious || false,
      ssl_valid: ssl?.valid,
      domain_age: whois?.data?.domainAge,
      search_count: 1,
      screenshot,
      search_data: {
        details: data.details,
        aiSummary,
        analysisDate: analysisDate || new Date().toISOString(),
      },
    });

    if (error) {
      console.error("Error saving domain search:", error);
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

    // Calculate the date threshold (current date minus maxAgeDays)
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - maxAgeDays);

    // Query for recent searches for this domain
    const { data, error } = await supabase
      .from("domain_searches")
      .select("*")
      .eq("domain", domain.toLowerCase().trim())
      .gte("created_at", dateThreshold.toISOString())
      .order("updated_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Error retrieving recent search:", error);
      return null;
    }

    // Return the most recent search or null if none found
    return data && data.length > 0 ? data[0] : null;
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

    // Get the most frequently searched domains
    const { data, error } = await supabase.rpc("get_trending_domains", {
      days_back: days,
      results_limit: limit,
    });

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

    const { data, error } = await supabase
      .from("domain_searches")
      .select("search_count")
      .eq("domain", domain.toLowerCase().trim());

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

    const { data, error } = await supabase
      .from("domain_searches")
      .select("domain, score, is_malicious, search_count, updated_at")
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

    const { data, error } = await supabase
      .from("domain_searches")
      .select("screenshot")
      .eq("domain", domain.toLowerCase().trim());

    if (error || !data || data.length === 0) {
      console.error("Error retrieving domain screenshot:", error);
      return null;
    }

    return data[0]?.screenshot || null;
  } catch (error) {
    console.error("Failed to get domain screenshot:", error);
    return null;
  }
}
