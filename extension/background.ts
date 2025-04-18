// Scam-Protector Background Service Worker
// Handles API communication and caching of domain scores

interface HostScoreMap {
  [hostname: string]: number;
}

interface ScoreDetails {
  score: number;
  details: {
    isMalicious: boolean;
    matches?: any[];
    domainAge?: number;
    ssl?: boolean;
    dnsScore?: number;
    error?: boolean;
  };
}

// Store scores in the local storage
const storeScores = async (scores: HostScoreMap): Promise<void> => {
  const now = Date.now();
  const storedItems: { [key: string]: { score: number; timestamp: number } } =
    {};

  Object.entries(scores).forEach(([host, score]) => {
    storedItems[host] = { score, timestamp: now };
    console.debug(`[Scam-Protector] Caching score for ${host}: ${score}`);
  });

  await chrome.storage.local.set(storedItems);
};

// Get scores from storage that haven't expired
const getStoredScores = async (hosts: string[]): Promise<HostScoreMap> => {
  const result = await chrome.storage.local.get(hosts);
  const validScores: HostScoreMap = {};
  const now = Date.now();
  const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

  hosts.forEach((host) => {
    const item = result[host];
    if (item && now - item.timestamp < CACHE_TTL) {
      validScores[host] = item.score;
      console.debug(
        `[Scam-Protector] Using cached score for ${host}: ${item.score}`
      );
    }
  });

  return validScores;
};

// Clear all cached scores - useful for debugging
const clearCachedScores = async (): Promise<void> => {
  try {
    await chrome.storage.local.clear();
    console.debug(`[Scam-Protector] All cached scores cleared`);
  } catch (error) {
    console.error(`[Scam-Protector] Error clearing cache:`, error);
  }
};

// Fetch scores from the API (using app's existing route)
const fetchScoresFromAPI = async (hosts: string[]): Promise<HostScoreMap> => {
  if (!hosts.length) return {};

  try {
    // Use the app's bulk-score API endpoint
    // The updated endpoint will use the same scoring as the web app
    const API_ENDPOINT = "https://scam-protector.com/api/bulk-score";

    console.debug(
      `[Scam-Protector] Fetching scores for ${hosts.length} hosts from bulk API`
    );
    console.debug(`[Scam-Protector] Hosts: ${hosts.join(", ")}`);

    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hosts }),
    });

    if (!response.ok) {
      throw new Error(`API returned status: ${response.status}`);
    }

    const data = await response.json();

    // Log returned scores for debugging
    console.debug("[Scam-Protector] API response scores:", data);

    return data as HostScoreMap;
  } catch (error) {
    console.error("[Scam-Protector] API error:", error);

    // Fallback: fetch each host individually through the single-domain endpoint
    console.debug("[Scam-Protector] Falling back to individual domain checks");

    const scoreMap: HostScoreMap = {};

    await Promise.all(
      hosts.map(async (host) => {
        try {
          const score = await fetchSingleDomainScore(host);
          scoreMap[host] = score;
          console.debug(`[Scam-Protector] ${host} individual score: ${score}`);
        } catch (innerError) {
          console.error(`Error fetching score for ${host}:`, innerError);
          // Default to a moderate score that won't trigger warnings
          scoreMap[host] = 50;
        }
      })
    );

    return scoreMap;
  }
};

// Fetch score for a single domain using the check-domain endpoint
const fetchSingleDomainScore = async (host: string): Promise<number> => {
  try {
    // Use the domain-security endpoint (same as used by the web form)
    // to ensure consistent scoring between extension and web input
    const CHECK_DOMAIN_ENDPOINT =
      "https://scam-protector.com/api/domain-security";

    console.debug(`[Scam-Protector] Checking single domain ${host}`);

    const response = await fetch(CHECK_DOMAIN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ domain: host }),
    });

    if (!response.ok) {
      throw new Error(`API returned status: ${response.status}`);
    }

    const data = await response.json();
    console.debug(
      `[Scam-Protector] ${host} domain check returned score: ${data.score}`
    );
    return data.score;
  } catch (error) {
    console.error(`[Scam-Protector] Error checking domain ${host}:`, error);
    return 50; // Default score when there's an error
  }
};

// Split array into chunks of specified size
function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

// Handle messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getScores") {
    const { hosts } = message;

    // Process the request in an async function
    (async () => {
      try {
        // Check if this is a debug request to clear cache
        if (message.clearCache) {
          await clearCachedScores();
          sendResponse({ success: true, message: "Cache cleared" });
          return;
        }

        // Check cache first
        const cachedScores = await getStoredScores(hosts);

        // Find which hosts are not in cache
        const missingHosts = hosts.filter(
          (host) => cachedScores[host] === undefined
        );

        if (missingHosts.length === 0) {
          // All scores were in cache
          console.debug(
            `[Scam-Protector] All ${hosts.length} hosts found in cache`
          );
          sendResponse(cachedScores);
          return;
        }

        console.debug(
          `[Scam-Protector] Fetching scores for ${missingHosts.length} missing hosts`
        );

        // Split into chunks of 10 to avoid hitting API limits
        const hostChunks = chunkArray(missingHosts, 10);
        let fetchedScores: HostScoreMap = {};

        // Fetch scores for each chunk
        for (const chunk of hostChunks) {
          const newScores = await fetchScoresFromAPI(chunk);
          fetchedScores = { ...fetchedScores, ...newScores };
        }

        // Store the new scores
        await storeScores(fetchedScores);

        // Combine cached and fetched scores
        const allScores = { ...cachedScores, ...fetchedScores };

        // Send the combined results back to the content script
        sendResponse(allScores);
      } catch (error) {
        console.error(
          "[Scam-Protector] Error processing score request:",
          error
        );
        sendResponse({});
      }
    })();

    // Return true to indicate we'll respond asynchronously
    return true;
  }
});
