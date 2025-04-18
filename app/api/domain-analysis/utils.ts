import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase";
import {
  getScoringWeights,
  getRiskFactorPenalties,
} from "@/lib/services/settingsService";
import type {
  ScoringWeights,
  RiskFactorPenalties,
} from "@/lib/services/settingsService";

/**
 * Get user ID from auth session if available
 */
export async function getUserId(
  request: NextRequest
): Promise<string | undefined> {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data } = await supabase.auth.getUser();
    return data?.user?.id;
  } catch (error) {
    console.error("Auth check error:", error);
    return undefined;
  }
}

/**
 * Security Details interface shared across domain analysis APIs
 */
export interface SecurityDetails {
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

/**
 * Calculate a security score based on multiple factors
 * @param securityDetails Object containing security check results
 * @returns A score from 0-100 where higher is safer
 */
export async function calculateSecurityScore(
  securityDetails: Partial<SecurityDetails>
): Promise<number> {
  // Get configuration from database
  let weights: ScoringWeights;
  let penalties: RiskFactorPenalties;

  try {
    // Fetch weights from database
    weights = await getScoringWeights();
    penalties = await getRiskFactorPenalties();
  } catch (error) {
    console.error("Error fetching score configurations:", error);
    // Fall back to defaults if database fetch fails
    weights = {
      safeBrowsing: 30,
      domainAge: 20,
      ssl: 15,
      dns: 15,
      patternAnalysis: 20,
      baselineScore: 70,
    };
    penalties = {
      manyRiskFactors: 8,
      severalRiskFactors: 4,
      privacyProtection: 2,
      whoisError: 3,
    };
  }

  // Initialize with the baseline score from configuration
  let score = weights.baselineScore;

  // Safe Browsing penalties - highest weighted factor
  if (securityDetails.safeBrowsing?.isMalicious) {
    // Severe penalty for Google's flags
    score -= weights.safeBrowsing;
  } else if (!securityDetails.safeBrowsing?.error) {
    // Bonus if explicitly confirmed safe by Google
    score += weights.safeBrowsing * 0.6;
  }

  // WHOIS-based scoring - focus on domain age
  if (securityDetails.whois?.data) {
    const domainAge = securityDetails.whois.data.domainAge || 0;

    if (domainAge < 7) {
      // Extremely new domains (less than a week) are highly suspicious
      score -= weights.domainAge;
    } else if (domainAge < 30) {
      // Very new domains (less than a month)
      score -= weights.domainAge * 0.7;
    } else if (domainAge < 90) {
      // Newer domains (less than 3 months)
      score -= weights.domainAge * 0.4;
    } else if (domainAge < 180) {
      // Domains less than 6 months
      score -= weights.domainAge * 0.2;
    } else if (domainAge >= 365 && domainAge < 1825) {
      // Bonus for domains older than a year (but less than 5 years)
      score += weights.domainAge * 0.4;
    } else if (domainAge >= 1825) {
      // Higher bonus for domains older than 5 years
      score += weights.domainAge * 0.7;
    }

    // Configurable penalty for privacy protection
    if (securityDetails.whois.data.privacyProtected) {
      score -= penalties.privacyProtection;
    }
  } else if (securityDetails.whois?.error) {
    // Configurable penalty if WHOIS data couldn't be retrieved
    score -= penalties.whoisError;
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
          score -= weights.ssl * 0.4;
        } else {
          // Bonus for valid certificate with good lifetime
          score += weights.ssl * 0.4;

          // Extra bonus for EV certificates (typically indicated in issuer)
          if (
            securityDetails.ssl.issuer &&
            (securityDetails.ssl.issuer.includes("Extended Validation") ||
              securityDetails.ssl.issuer.includes("EV"))
          ) {
            score += 7; // Increased bonus for EV certificates
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
    if (securityDetails.dns.hasMX) dnsScore += 4;
    if (securityDetails.dns.hasSPF) dnsScore += 5;
    if (securityDetails.dns.hasDMARC) dnsScore += 6;

    // Apply weighted DNS score
    score += (dnsScore / 15) * weights.dns;
  }

  // Apply pattern analysis penalties
  const suspiciousScore = securityDetails.patternAnalysis?.suspiciousScore || 0;
  score -= (suspiciousScore / 100) * weights.patternAnalysis;

  // Apply bonus for major verified domains (using a heuristic approach)
  if (
    securityDetails.whois?.data &&
    !securityDetails.safeBrowsing?.isMalicious
  ) {
    // Check if the domain is older than 5 years and has valid SSL
    const isEstablishedDomain =
      (securityDetails.whois.data.domainAge || 0) > 1825 &&
      securityDetails.ssl?.valid === true;

    // Check if it has proper DNS security configuration
    const hasGoodSecurity =
      securityDetails.dns?.hasSPF === true &&
      securityDetails.dns?.hasDMARC === true;

    // Award bonus points for well-established domains with good security
    if (isEstablishedDomain && hasGoodSecurity) {
      score += 5;
    }
  }

  // Adjust based on combined risk factors count from all sources
  const totalRiskFactors = [
    ...(securityDetails.whois?.riskFactors || []),
    ...(securityDetails.dns?.riskFactors || []),
    ...(securityDetails.patternAnalysis?.riskFactors || []),
  ].length;

  if (totalRiskFactors > 5) {
    score -= penalties.manyRiskFactors;
  } else if (totalRiskFactors > 2) {
    score -= penalties.severalRiskFactors;
  }

  // Ensure score stays within 0-100 range
  return Math.max(0, Math.min(100, Math.round(score)));
}
