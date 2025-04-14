import { NextRequest, NextResponse } from "next/server";
import { checkSafeBrowsing } from "@/lib/services/safeBrowsingService";
import { checkWhois } from "@/lib/services/whoisService";
import {
  generateAISummary,
  analyzeDomainName,
} from "@/lib/services/aiSummaryService";

interface RequestBody {
  domain: string;
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
  patternAnalysis: {
    riskFactors: string[];
    suspiciousScore: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RequestBody;
    const cleanDomain = body.domain.trim().toLowerCase();

    // Initialize security details object
    const securityDetails: Partial<SecurityDetails> = {};

    // Run security checks in parallel
    const [safeBrowsingResult, whoisResult, patternAnalysis] =
      await Promise.all([
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
        analyzeDomainName(cleanDomain),
      ]);

    // Update security details with results
    securityDetails.safeBrowsing = safeBrowsingResult;
    securityDetails.whois = whoisResult;
    securityDetails.patternAnalysis = patternAnalysis;

    // Calculate comprehensive security score
    const score = calculateSecurityScore(securityDetails);

    // Generate AI summary with the correct data structure
    const aiSummary = await generateAISummary({
      domain: cleanDomain,
      score,
      safeBrowsing: securityDetails.safeBrowsing,
      whois: securityDetails.whois,
    }).catch((error) => {
      console.error("AI summary error:", error);
      return null;
    });

    // Format the response
    return NextResponse.json({
      domain: cleanDomain,
      score,
      aiSummary,
      details: securityDetails,
      analysisDate: new Date().toISOString(),
    });
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
  let score = 100;

  // Safe Browsing penalties
  if (securityDetails.safeBrowsing?.isMalicious) {
    score -= 60; // Heavy penalty for known malicious sites
  }

  // WHOIS-based penalties
  if (securityDetails.whois?.data) {
    const domainAge = securityDetails.whois.data.domainAge || 0;
    if (domainAge < 30) {
      score -= 30; // Very new domains are suspicious
    } else if (domainAge < 90) {
      score -= 20; // Newer domains get a smaller penalty
    } else if (domainAge < 180) {
      score -= 10; // Small penalty for domains under 6 months
    }

    if (securityDetails.whois.data.privacyProtected) {
      score -= 10; // Small penalty for privacy protection (could be legitimate but also used by scammers)
    }
  }

  // Pattern analysis penalties
  const suspiciousScore = securityDetails.patternAnalysis?.suspiciousScore || 0;
  score -= suspiciousScore;

  // Ensure score stays within 0-100 range
  return Math.max(0, Math.min(100, score));
}
