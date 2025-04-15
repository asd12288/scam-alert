import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase";

/**
 * Get user ID from auth session if available
 */
export async function getUserId(request: NextRequest): Promise<string | undefined> {
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
export function calculateSecurityScore(
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