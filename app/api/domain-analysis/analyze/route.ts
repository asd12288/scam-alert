import { NextRequest, NextResponse } from "next/server";
import { checkSafeBrowsing } from "@/lib/services/safeBrowsingService";
import { checkWhois } from "@/lib/services/whoisService";
import { checkSSLCertificate } from "@/lib/services/sslService";
import { analyzeDNS } from "@/lib/services/dnsService";
import { generateAISummary, analyzeDomainName } from "@/lib/services/aiSummaryService";
import { 
  saveDomainSearch, 
  getRecentDomainSearch, 
  getDomainSearchCount, 
  getDomainScreenshot 
} from "@/lib/services/searchHistoryService";
import { getUserId, calculateSecurityScore, SecurityDetails } from "../utils";

interface RequestBody {
  domain: string;
  forceRefresh?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RequestBody;
    const cleanDomain = body.domain.trim().toLowerCase();
    const forceRefresh = body.forceRefresh || false;

    // Get user ID if authenticated
    const userId = await getUserId(request);
    
    // Get the current search count for the domain (for the response)
    const searchCount = await getDomainSearchCount(cleanDomain);
    
    // Check for recent search results in database (not older than 2 weeks)
    // Skip this check if forceRefresh is true
    let recentSearch = null;
    let cachedScreenshot = null;
    
    if (!forceRefresh) {
      recentSearch = await getRecentDomainSearch(cleanDomain, 14);
      
      // If recent search doesn't contain a screenshot, try to get it separately
      if (recentSearch && !recentSearch.screenshot) {
        cachedScreenshot = await getDomainScreenshot(cleanDomain);
      }
    }
    
    if (recentSearch && !forceRefresh) {
      console.log(`Using cached search data for ${cleanDomain} from ${recentSearch.created_at}`);
      
      // Return the cached result with search count
      return NextResponse.json({
        domain: cleanDomain,
        score: recentSearch.score,
        aiSummary: recentSearch.search_data.aiSummary,
        details: recentSearch.search_data.details,
        analysisDate: recentSearch.created_at,
        screenshot: recentSearch.screenshot || cachedScreenshot,
        searchCount: recentSearch.search_count,
        cached: true,  // Indicate this is cached data
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
        const screenshotResponse = await fetch(`${request.nextUrl.origin}/api/domain-analysis/screenshot`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain: cleanDomain }),
        });
        
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
      cached: false,  // Indicate this is fresh data
    };

    // Save search data to Supabase (don't await to avoid delaying response)
    saveDomainSearch({
      domain: cleanDomain,
      score,
      details: securityDetails,
      aiSummary,
      analysisDate: responseData.analysisDate,
      screenshot,
    }, userId)
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