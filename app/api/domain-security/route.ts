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

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body: RequestBody = await request.json();
    const domain = body.domain?.trim();

    // Validate domain input
    if (!domain) {
      return NextResponse.json(
        { error: "Domain is required" },
        { status: 400 }
      );
    }

    // Clean the domain (remove protocol, www, etc.)
    const cleanDomain = domain
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./i, "")
      .split("/")[0];

    // Initialize security details object
    const securityDetails: any = {
      safeBrowsing: null,
      whois: null,
      patternAnalysis: null,
    };

    // Perform all checks in parallel
    const [safeBrowsingResult, whoisResult, patternAnalysis] =
      await Promise.all([
        checkSafeBrowsing(cleanDomain).catch((error) => {
          console.error("Safe Browsing API error:", error);
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

    // Generate AI summary
    const aiAnalysis = await generateAISummary(
      cleanDomain,
      securityDetails
    ).catch((error) => {
      console.error("AI summary error:", error);
      return { summary: null, score: null };
    });

    // Use AI score if available to enhance our calculation
    let finalScore = score;
    if (aiAnalysis.score !== null) {
      // Weighted average: 60% AI score, 40% our algorithmic score
      finalScore = Math.round(0.6 * aiAnalysis.score + 0.4 * score);
    }

    // Format the response
    return NextResponse.json({
      domain: cleanDomain,
      score: finalScore,
      aiSummary: aiAnalysis.summary,
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
function calculateSecurityScore(securityDetails: any): number {
  let score = 100; // Start with perfect score and subtract for issues

  // Safe Browsing check (severe penalty if flagged)
  if (securityDetails.safeBrowsing?.isMalicious) {
    score -= 60; // Major penalty for being flagged by Google
  }

  // WHOIS data checks
  if (securityDetails.whois?.data) {
    const whoisData = securityDetails.whois.data;

    // Domain age checks (newer domains are riskier)
    if (whoisData.domainAge !== undefined) {
      if (whoisData.domainAge < 30) {
        score -= 30; // Very new domain
      } else if (whoisData.domainAge < 90) {
        score -= 20; // Relatively new domain
      } else if (whoisData.domainAge < 180) {
        score -= 10; // Moderately new domain
      } else if (whoisData.domainAge < 365) {
        score -= 5; // Less than a year old
      }
    }

    // Privacy protection (slight penalty, legitimate sites use these too)
    if (whoisData.privacyProtected) {
      score -= 5;
    }

    // Missing registrar or registrant information
    if (!whoisData.registrar) {
      score -= 5;
    }
    if (!whoisData.registrantName && !whoisData.registrantOrganization) {
      score -= 5;
    }
  } else {
    // Couldn't get WHOIS data at all
    score -= 10;
  }

  // WHOIS risk factors from analysis
  if (securityDetails.whois?.riskFactors) {
    score -= securityDetails.whois.riskFactors.length * 5; // 5 points per risk factor
  }

  // Pattern analysis from domain name
  if (securityDetails.patternAnalysis) {
    // Apply the suspiciousScore from pattern analysis
    score -= securityDetails.patternAnalysis.suspiciousScore;
  }

  // Ensure score stays within 0-100 range
  return Math.max(0, Math.min(100, Math.round(score)));
}
