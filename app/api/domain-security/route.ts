import { NextRequest, NextResponse } from "next/server";
import { checkSafeBrowsing } from "@/lib/services/safeBrowsingService";
import { checkWhois } from "@/lib/services/whoisService";
import { checkSSLCertificate } from "@/lib/services/sslService";
import { analyzeDNS } from "@/lib/services/dnsService";
import {
  generateAISummary,
  analyzeDomainName,
} from "@/lib/services/aiSummaryService";
import {
  saveDomainSearch,
  getRecentDomainSearch,
  getDomainSearchCount,
  getDomainScreenshot,
} from "@/lib/services/searchHistoryService";
import { createClient } from "@/lib/supabase";
import { cookies } from "next/headers";

interface RequestBody {
  domain: string;
  forceRefresh?: boolean;
}

interface SecurityDetails {
  safeBrowsing: {
    isMalicious: boolean;
    error?: boolean;
    message?: string;
    matches?: Array<{
      threatType: string;
      platformType: string;
      threat: { url: string };
      cacheDuration: string;
      threatEntryType: string;
    }>;
  };
  whois: {
    data: {
      domainAge?: number;
      creationDate?: string;
      expirationDate?: string;
      registrar?: string;
      registrantName?: string;
      registrantOrganization?: string;
      privacyProtected?: boolean;
    };
    error?: boolean;
    message?: string;
    riskFactors?: string[];
  };
  ssl: {
    valid: boolean;
    daysRemaining?: number;
    validFrom?: string;
    validTo?: string;
    issuer?: string;
    validForHost?: boolean;
    error?: boolean;
    message?: string;
    score?: number;
  };
  dns: {
    hasMX: boolean;
    hasSPF: boolean;
    hasDMARC: boolean;
    mxRecords: string[];
    txtRecords: string[];
    spfRecord?: string;
    dmarcRecord?: string;
    riskFactors: string[];
    securityScore: number;
    error?: boolean;
    message?: string;
  };
  patternAnalysis: {
    riskFactors: string[];
    suspiciousScore: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RequestBody;
    const cleanDomain = body.domain.trim().toLowerCase();
    const forceRefresh = body.forceRefresh || false;

    // Check if user is authenticated
    let userId: string | undefined;
    try {
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);
      const { data } = await supabase.auth.getUser();
      userId = data?.user?.id;
    } catch (authError) {
      console.error("Auth check error:", authError);
      // Continue without userId - still collect anonymous search data
    }

    // Get the current search count for the domain (for the response)
    const searchCount = await getDomainSearchCount(cleanDomain);

    // Check for recent search results in database (not older than 2 weeks)
    // Skip this check if forceRefresh is true
    let recentSearch = null;
    let cachedScreenshot = null;

    if (!forceRefresh) {
      recentSearch = await getRecentDomainSearch(cleanDomain, 14);

      // If recent search doesn't contain a screenshot, try to get it separately
      // This ensures we don't lose screenshots when doing a partial cache refresh
      if (recentSearch && !recentSearch.screenshot) {
        cachedScreenshot = await getDomainScreenshot(cleanDomain);
      }
    }

    if (recentSearch && !forceRefresh) {
      console.log(
        `Using cached search data for ${cleanDomain} from ${recentSearch.created_at}`
      );

      // Return the cached result with search count
      return NextResponse.json({
        domain: cleanDomain,
        score: recentSearch.score,
        aiSummary: recentSearch.search_data.aiSummary,
        details: recentSearch.search_data.details,
        analysisDate: recentSearch.created_at,
        screenshot: recentSearch.screenshot || cachedScreenshot,
        searchCount: recentSearch.search_count,
        cached: true, // Indicate this is cached data
      });
    }

    // No recent data found or refresh requested, perform a new analysis
    // Initialize security details object
    const securityDetails: Partial<SecurityDetails> = {};

    // Run security checks in parallel
    const [
      safeBrowsingResult,
      whoisResult,
      sslResult,
      dnsResult,
      patternAnalysis,
    ] = await Promise.all([
      checkSafeBrowsing(cleanDomain).catch((error) => {
        console.error("Safe Browsing error:", error);
        return {
          isMalicious: false,
          error: true,
          message: "Failed to check Safe Browsing API",
        };
      }),
      checkWhois(cleanDomain).catch((error) => {
        console.error("WHOIS error:", error);
        return {
          data: {},
          error: true,
          message: "Failed to check WHOIS data",
        };
      }),
      checkSSLCertificate(cleanDomain).catch((error) => {
        console.error("SSL error:", error);
        return {
          valid: false,
          error: true,
          message: "Failed to check SSL certificate",
        };
      }),
      analyzeDNS(cleanDomain).catch((error) => {
        console.error("DNS analysis error:", error);
        return {
          hasMX: false,
          hasSPF: false,
          hasDMARC: false,
          mxRecords: [],
          txtRecords: [],
          riskFactors: ["Failed to analyze DNS records"],
          securityScore: 0,
          error: true,
          message: "Failed to analyze DNS records",
        };
      }),
      analyzeDomainName(cleanDomain),
    ]);

    // Update security details with results
    securityDetails.safeBrowsing = safeBrowsingResult;
    securityDetails.whois = whoisResult;
    securityDetails.ssl = sslResult;
    securityDetails.dns = dnsResult;
    securityDetails.patternAnalysis = patternAnalysis;

    // Calculate comprehensive security score
    const score = calculateSecurityScore(securityDetails);

    // Generate AI summary with the correct data structure
    const aiSummary = await generateAISummary({
      domain: cleanDomain,
      score,
      safeBrowsing: securityDetails.safeBrowsing,
      whois: securityDetails.whois,
      ssl: securityDetails.ssl,
      dns: securityDetails.dns,
    }).catch((error) => {
      console.error("AI summary error:", error);
      return null;
    });

    // Try to get a screenshot if we have one cached but are doing a data refresh
    let screenshot = cachedScreenshot;

    // If no cached screenshot, try to get a fresh one
    if (!screenshot) {
      try {
        const screenshotResponse = await fetch(
          `${request.nextUrl.origin}/api/website-screenshot`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ domain: cleanDomain }),
          }
        );

        const screenshotData = await screenshotResponse.json();
        if (screenshotData.success && screenshotData.screenshot) {
          screenshot = screenshotData.screenshot;
        }
      } catch (error) {
        console.error("Error fetching screenshot:", error);
        // Continue without screenshot
      }
    }

    // Prepare response data
    const responseData = {
      domain: cleanDomain,
      score,
      aiSummary,
      details: securityDetails,
      screenshot,
      analysisDate: new Date().toISOString(),
      searchCount: searchCount + 1, // Increment the count for display
      cached: false, // Indicate this is fresh data
    };

    // Save search data to Supabase including screenshot (don't await to avoid delaying response)
    saveDomainSearch(
      {
        domain: cleanDomain,
        score,
        details: securityDetails,
        aiSummary,
        analysisDate: responseData.analysisDate,
        screenshot,
      },
      userId
    )
      .then((saved) => {
        if (!saved) {
          console.warn(`Failed to save search for domain: ${cleanDomain}`);
        }
      })
      .catch((error) => {
        console.error("Error saving domain search:", error);
      });

    // Format the response
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Domain security check error:", error);
    return NextResponse.json(
      { error: "Failed to check domain security" },
      { status: 500 }
    );
  }
}

/**
 * Calculate a security score based on multiple factors
 * @param securityDetails Object containing security check results
 * @returns A score from 0-100 where higher is safer
 */
function calculateSecurityScore(
  securityDetails: Partial<SecurityDetails>
): number {
  // Initialize with a baseline score
  let score = 60;

  // Define weights for different security factors
  const weights = {
    safeBrowsing: 25, // Google's Safe Browsing has the highest impact
    domainAge: 20, // Domain age is a significant factor
    ssl: 20, // SSL certificates are important for trust
    dns: 10, // DNS configuration indicates legitimacy
    patternAnalysis: 25, // Domain name patterns provide additional signals
  };

  // Safe Browsing penalties - highest weighted factor
  if (securityDetails.safeBrowsing?.isMalicious) {
    // Severe penalty for Google's flags
    score -= weights.safeBrowsing;
  } else if (!securityDetails.safeBrowsing?.error) {
    // Bonus if explicitly confirmed safe by Google
    score += weights.safeBrowsing * 0.5;
  }

  // WHOIS-based scoring - focus on domain age
  if (securityDetails.whois?.data) {
    const domainAge = securityDetails.whois.data.domainAge || 0;

    if (domainAge < 7) {
      // Extremely new domains (less than a week) are highly suspicious
      score -= weights.domainAge;
    } else if (domainAge < 30) {
      // Very new domains (less than a month)
      score -= weights.domainAge * 0.8;
    } else if (domainAge < 90) {
      // Newer domains (less than 3 months)
      score -= weights.domainAge * 0.5;
    } else if (domainAge < 180) {
      // Domains less than 6 months
      score -= weights.domainAge * 0.25;
    } else if (domainAge >= 365) {
      // Bonus for domains older than a year
      score += weights.domainAge * 0.3;
    }

    // Smaller penalty for privacy protection (could be legitimate but also used by scammers)
    if (securityDetails.whois.data.privacyProtected) {
      score -= 5;
    }
  } else if (securityDetails.whois?.error) {
    // Small penalty if WHOIS data couldn't be retrieved
    score -= 5;
  }

  // SSL certificate evaluation
  if (securityDetails.ssl) {
    if (!securityDetails.ssl.valid) {
      // Significant penalty for invalid SSL
      score -= weights.ssl;
    } else {
      // Apply graduated scoring based on certificate lifetime
      if (securityDetails.ssl.daysRemaining !== undefined) {
        if (securityDetails.ssl.daysRemaining < 7) {
          // Critical - about to expire
          score -= weights.ssl * 0.8;
        } else if (securityDetails.ssl.daysRemaining < 30) {
          // Warning - expiring soon
          score -= weights.ssl * 0.5;
        } else {
          // Bonus for valid certificate with good lifetime
          score += weights.ssl * 0.3;

          // Extra bonus for EV certificates (typically indicated in issuer)
          if (
            securityDetails.ssl.issuer &&
            (securityDetails.ssl.issuer.includes("Extended Validation") ||
              securityDetails.ssl.issuer.includes("EV"))
          ) {
            score += 5;
          }
        }
      }
    }
  }

  // DNS analysis score contributions
  if (securityDetails.dns) {
    // Evaluate quality of DNS setup
    let dnsScore = 0;

    // Award points for proper email security
    if (securityDetails.dns.hasMX) dnsScore += 3;
    if (securityDetails.dns.hasSPF) dnsScore += 4;
    if (securityDetails.dns.hasDMARC) dnsScore += 8;

    // Apply weighted DNS score
    score += (dnsScore / 15) * weights.dns;
  }

  // Apply pattern analysis penalties
  const suspiciousScore = securityDetails.patternAnalysis?.suspiciousScore || 0;
  score -= (suspiciousScore / 100) * weights.patternAnalysis;

  // Adjust based on combined risk factors count from all sources
  const totalRiskFactors = [
    ...(securityDetails.whois?.riskFactors || []),
    ...(securityDetails.dns?.riskFactors || []),
    ...(securityDetails.patternAnalysis?.riskFactors || []),
  ].length;

  if (totalRiskFactors > 5) {
    score -= 10; // Many risk factors found
  } else if (totalRiskFactors > 2) {
    score -= 5; // Several risk factors found
  }

  // Ensure score stays within 0-100 range
  return Math.max(0, Math.min(100, Math.round(score)));
}
