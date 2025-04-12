import axios from "axios";

// WhoisXML API key - replace with your actual API key
const WHOIS_API_KEY =
  process.env.NEXT_PUBLIC_WHOISXML_API_KEY || "your_api_key_here";
const WHOIS_API_URL = "https://www.whoisxmlapi.com/whoisserver/WhoisService";

/**
 * Interface for WHOIS API response data
 */
interface WhoisData {
  domainName?: string;
  creationDate?: string;
  expirationDate?: string;
  registrar?: string;
  registrantName?: string;
  registrantOrganization?: string;
  registrantCountry?: string;
  registrarUrl?: string;
  contactEmail?: string;
  updatedDate?: string;
  domainAge?: number; // in days
  nameServers?: string[];
  status?: string[];
  parseCode?: number;
  audit?: {
    createdDate: string;
    updatedDate: string;
  };
  customFields?: {
    estimatedDomainAge?: number;
    noRecordFound?: boolean; // Flag to indicate if no record was found at all
  };
  privacyProtected?: boolean;
}

/**
 * Fetches WHOIS data for a domain using WhoisXML API
 * @param domain The domain to look up
 * @returns WhoisData object with domain registration information
 */
export async function getWhoisData(domain: string): Promise<WhoisData> {
  try {
    // Clean the domain (remove protocol, path, query params)
    const cleanDomain = domain.replace(/^https?:\/\//, "").split("/")[0];

    const response = await axios.get(WHOIS_API_URL, {
      params: {
        apiKey: WHOIS_API_KEY,
        domainName: cleanDomain,
        outputFormat: "JSON",
        preferFresh: "1",
      },
    });

    const data = response.data?.WhoisRecord || {};

    // Check if we have meaningful data from the API
    const hasNoRecord =
      !data.domainName ||
      Object.keys(data).length <= 1 ||
      data.dataError === "MISSING_WHOIS_DATA";

    // Calculate domain age in days if creation date is available
    const creationDate = data.createdDate || data.registryData?.createdDate;
    let domainAge;

    if (creationDate) {
      const creationTime = new Date(creationDate).getTime();
      const currentTime = new Date().getTime();
      domainAge = Math.floor(
        (currentTime - creationTime) / (1000 * 60 * 60 * 24)
      ); // convert to days
    }

    // Check for privacy protection services
    const privacyProtected = isPrivacyProtected(data);

    // Extract and format WHOIS data
    return {
      domainName: data.domainName,
      creationDate: data.createdDate || data.registryData?.createdDate,
      expirationDate: data.expiresDate || data.registryData?.expiresDate,
      registrar: data.registrarName || data.registryData?.registrarName,
      registrantName:
        data.registrant?.name || data.registryData?.registrant?.name,
      registrantOrganization:
        data.registrant?.organization ||
        data.registryData?.registrant?.organization,
      registrantCountry:
        data.registrant?.country || data.registryData?.registrant?.country,
      registrarUrl: data.registrarUrl,
      contactEmail:
        data.contactEmail ||
        data.registrant?.email ||
        data.registryData?.registrant?.email,
      updatedDate: data.updatedDate || data.registryData?.updatedDate,
      domainAge,
      nameServers: Array.isArray(data.nameServers)
        ? data.nameServers.map((ns: any) => ns.hostName || ns).filter(Boolean)
        : [],
      status: Array.isArray(data.status)
        ? data.status
        : [data.status].filter(Boolean),
      parseCode: data.parseCode,
      audit: {
        createdDate: data.audit?.createdDate,
        updatedDate: data.audit?.updatedDate,
      },
      customFields: {
        estimatedDomainAge: domainAge,
        noRecordFound: hasNoRecord, // Flag when no domain record exists
      },
      privacyProtected,
    };
  } catch (error) {
    console.error("Error fetching WHOIS data:", error);
    // Return an object indicating no record was found due to error
    return {
      customFields: {
        noRecordFound: true,
      },
    };
  }
}

/**
 * Determines if a domain uses privacy protection services
 */
function isPrivacyProtected(whoisData: any): boolean {
  // Common privacy protection service identifiers
  const privacyKeywords = [
    "privacy protect",
    "whoisguard",
    "whois guard",
    "privacy service",
    "private registration",
    "domains by proxy",
    "perfect privacy",
    "withheld for privacy",
    "redacted for privacy",
    "contact privacy",
    "privacydotlink",
    "privacy-protect",
    "gdpr redacted",
    "gdpr masked",
    "redacted for gdpr",
    "redacted for data protection",
  ];

  // Check registrant fields for privacy protection indicators
  const fieldsToCheck = [
    whoisData.registrant?.name,
    whoisData.registrant?.organization,
    whoisData.contactEmail,
    whoisData.registryData?.registrant?.name,
    whoisData.registryData?.registrant?.organization,
    whoisData.registryData?.registrant?.email,
    whoisData.registrarName,
  ];

  // Check if any fields contain privacy protection keywords
  for (const field of fieldsToCheck) {
    if (!field) continue;

    const fieldLower = field.toLowerCase();
    if (privacyKeywords.some((keyword) => fieldLower.includes(keyword))) {
      return true;
    }
  }

  // Check for standard privacy protection patterns
  const hasRedactedEmails =
    (whoisData.contactEmail && whoisData.contactEmail.includes("redacted")) ||
    (whoisData.registryData?.registrant?.email &&
      whoisData.registryData?.registrant?.email.includes("redacted"));

  const hasGenericNames =
    whoisData.registrant?.name?.includes("Domain Admin") ||
    whoisData.registrant?.name?.includes("Domain Administrator");

  return hasRedactedEmails || hasGenericNames;
}

/**
 * Analyzes WHOIS data to determine domain risk factors
 * @param whoisData The WHOIS data to analyze
 * @returns Risk score and factors
 */
export function analyzeWhoisRisk(whoisData: WhoisData): {
  score: number;
  factors: string[];
} {
  const factors: string[] = [];
  let riskPoints = 0;

  // Check if no record was found at all - this is a major red flag
  if (whoisData.customFields?.noRecordFound) {
    factors.push("No domain registration record found");
    riskPoints += 75; // Very high risk for no record at all

    // Return immediately with the high risk score if no record exists
    return {
      score: Math.min(100, Math.max(0, riskPoints)),
      factors,
    };
  }

  // Domain age is a significant factor - newer domains are higher risk
  if (!whoisData.domainAge) {
    factors.push("Unknown domain age");
    riskPoints += 15;
  } else if (whoisData.domainAge < 30) {
    factors.push("Domain is less than 30 days old");
    riskPoints += 25;
  } else if (whoisData.domainAge < 90) {
    factors.push("Domain is less than 90 days old");
    riskPoints += 15;
  } else if (whoisData.domainAge < 180) {
    factors.push("Domain is less than 6 months old");
    riskPoints += 10;
  }

  // Missing registrant information is suspicious
  if (!whoisData.registrantName && !whoisData.registrantOrganization) {
    factors.push("Missing registrant information");
    riskPoints += 15;
  }

  // Privacy protection isn't necessarily bad, but can be a factor
  if (whoisData.privacyProtected) {
    factors.push("Privacy protection service used");
    riskPoints += 15;
  }

  // Check for upcoming expiration
  if (whoisData.expirationDate) {
    const expirationDate = new Date(whoisData.expirationDate);
    const daysUntilExpiration = Math.floor(
      (expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilExpiration < 30) {
      factors.push("Domain expires in less than 30 days");
      riskPoints += 10;
    }
  }

  // Calculate final score (0-100, lower is better for WHOIS score)
  // This is opposite of overall score, will be inverted when combined
  const score = Math.min(100, Math.max(0, riskPoints));

  return {
    score,
    factors,
  };
}

/**
 * Combined WHOIS scoring with overall domain risk assessment
 * @param whoisData The WHOIS data to analyze
 * @returns Risk score (0-100, higher is better)
 */
export function getWhoisScore(whoisData: WhoisData): number {
  const { score: riskScore } = analyzeWhoisRisk(whoisData);

  // Invert the risk score (since higher is better in our overall system)
  return Math.max(0, 100 - riskScore);
}

/**
 * Comprehensive WHOIS check function that fetches data and performs risk analysis
 * @param domain The domain to check
 * @returns Object with WHOIS data, risk factors, and score
 */
export async function checkWhois(domain: string): Promise<{
  data: WhoisData;
  riskFactors: string[];
  score: number;
  error?: boolean;
  message?: string;
}> {
  try {
    // Get WHOIS data for the domain
    const whoisData = await getWhoisData(domain);

    // If there's no record or an error occurred
    if (whoisData.customFields?.noRecordFound) {
      return {
        data: whoisData,
        riskFactors: ["No WHOIS record found for this domain"],
        score: 50, // Neutral score when no data is available
        error: true,
        message: "Could not find WHOIS data for this domain",
      };
    }

    // Analyze the data for risk factors
    const riskAnalysis = analyzeWhoisRisk(whoisData);

    // Calculate the final WHOIS score (higher is better/safer)
    const score = getWhoisScore(whoisData);

    return {
      data: whoisData,
      riskFactors: riskAnalysis.factors,
      score,
    };
  } catch (error) {
    console.error("Error in WHOIS check:", error);
    return {
      data: {},
      riskFactors: ["Error retrieving WHOIS information"],
      score: 50, // Neutral score on error
      error: true,
      message: "Failed to retrieve WHOIS data",
    };
  }
}
