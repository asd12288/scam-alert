import safeBrowseLookup from "safe-browse-url-lookup";

// Replace with your actual Google Safe Browsing API key
// You will need to get this from the Google Cloud Console
const API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_SAFE_BROWSING_API_KEY || "YOUR_API_KEY";

// Create the Safe Browse lookup client
const lookup = safeBrowseLookup({ apiKey: API_KEY });

/**
 * Checks if a domain is safe using the Google Safe Browsing API
 *
 * @param domain The domain to check
 * @returns A score from 0-100, where higher is safer
 */
export async function checkDomainSafety(domain: string): Promise<number> {
  try {
    // Ensure the domain has a protocol
    const url = domain.startsWith("http") ? domain : `https://${domain}`;

    // Check if the URL is in Google's list of unsafe web resources
    const isMalicious = await lookup.checkSingle(url);

    // If the domain is flagged as malicious, return a low score
    if (isMalicious) {
      return 20; // Very low score for known malicious sites
    }

    // For demo purposes, we'll return a high score if not malicious
    // In a real app, you would add more criteria here
    return 95;
  } catch (error) {
    console.error("Error checking domain safety:", error);
    // Return a neutral score if there was an error
    return 50;
  }
}

/**
 * For testing only: Checks a Google test URL that is guaranteed to be flagged as malicious
 *
 * @returns A safety score based on the test URL's result
 */
export async function testSafeBrowsingAPI(): Promise<number> {
  try {
    // Google provides this test URL that will always be detected as malicious
    const testUrl =
      "http://testsafebrowsing.appspot.com/apiv4/ANY_PLATFORM/MALWARE/URL/";

    const isMalicious = await lookup.checkSingle(testUrl);

    // This should be true if the API is working correctly
    console.log("Test URL is malicious:", isMalicious);

    return isMalicious ? 10 : 90;
  } catch (error) {
    console.error("Error testing Safe Browsing API:", error);
    return 50;
  }
}

/**
 * Expands the domain safety check with additional criteria in the future
 *
 * @param domain The domain to analyze
 * @returns A safety score object with details
 */
export async function analyzeDomainSafety(domain: string): Promise<{
  score: number;
  details: {
    isMalicious: boolean;
    // You can add more criteria here in the future
  };
}> {
  try {
    // Ensure the domain has a protocol
    const url = domain.startsWith("http") ? domain : `https://${domain}`;

    // Check if the URL is in Google's list of unsafe web resources
    const isMalicious = await lookup.checkSingle(url);

    // Calculate a score based on whether the domain is malicious
    const score = isMalicious ? 20 : 95;

    return {
      score,
      details: {
        isMalicious,
      },
    };
  } catch (error) {
    console.error("Error analyzing domain safety:", error);

    return {
      score: 50,
      details: {
        isMalicious: false,
      },
    };
  }
}

/**
 * Checks a domain against Google Safe Browsing API and returns detailed results
 *
 * @param domain Domain to check (without protocol)
 * @returns Object with isMalicious flag and any match details
 */
export async function checkSafeBrowsing(domain: string): Promise<{
  isMalicious: boolean;
  matches?: any[];
  error?: boolean;
  message?: string;
}> {
  try {
    // Format the URL properly
    const url = domain.startsWith("http") ? domain : `https://${domain}`;

    // Ensure urlsToCheck is always an array, even if domain is passed as another type
    const urlsToCheck = Array.isArray(url) ? url : [url];

    try {
      // Check the URLs against Google Safe Browsing
      const result = await lookup.checkMulti(urlsToCheck);

      // If the URL is in the result object, it's flagged as malicious
      const isMalicious = result[url] === true;

      if (isMalicious) {
        // For a real implementation, you would get more details about the threats
        // from the Lookup API or the full Safe Browsing API
        return {
          isMalicious: true,
          matches: [
            {
              threatType: "MALWARE",
              platformType: "ANY_PLATFORM",
              threat: { url },
            },
          ],
        };
      }

      // Return clean result
      return {
        isMalicious: false,
        matches: [],
      };
    } catch (error: any) {
      // Check if this is a "not in list" error, which means the domain is safe
      if (error.message && error.message.includes("not in the list")) {
        return {
          isMalicious: false,
          matches: [],
        };
      }

      // Otherwise it's a real error
      throw error;
    }
  } catch (error) {
    console.error(`Error checking ${domain} with Safe Browsing API:`, error);
    return {
      isMalicious: false,
      error: true,
      message: "Failed to check domain with Safe Browsing API",
    };
  }
}
