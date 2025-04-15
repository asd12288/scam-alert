import sslChecker from "ssl-checker";

/**
 * Checks SSL/TLS certificate information for a domain
 *
 * @param domain Domain to check (without protocol)
 * @returns SSL certificate information and validation score
 */
export async function checkSSLCertificate(domain: string): Promise<{
  valid: boolean;
  daysRemaining?: number;
  validFrom?: string;
  validTo?: string;
  issuer?: string;
  validForHost?: boolean;
  error?: boolean;
  message?: string;
  score?: number;
}> {
  try {
    // Clean the domain (remove protocol if present)
    const cleanDomain = domain.replace(/^https?:\/\//, "").split("/")[0];

    // Check SSL certificate
    const sslData = await sslChecker(cleanDomain);

    // Calculate certificate score based on days remaining and validity
    let score = 0;
    if (sslData.valid) {
      // Base score for valid certificate
      score = 20;

      // Bonus points for longer validity
      if (sslData.daysRemaining > 90) {
        score += 5;
      }
      if (sslData.daysRemaining > 180) {
        score += 5;
      }

      // Penalty for certificates expiring soon
      if (sslData.daysRemaining < 30) {
        score -= 10;
      }
      if (sslData.daysRemaining < 7) {
        score -= 15;
      }
    }

    return {
      valid: sslData.valid,
      daysRemaining: sslData.daysRemaining,
      validFrom: sslData.validFrom,
      validTo: sslData.validTo,
      issuer: sslData.issuer,
      validForHost: sslData.validForHostname,
      score,
    };
  } catch (error) {
    console.error(`Error checking SSL for ${domain}:`, error);
    return {
      valid: false,
      error: true,
      message: `Failed to check SSL certificate: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      score: 0,
    };
  }
}
