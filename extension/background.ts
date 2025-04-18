// Scam-Protector Background Service Worker
// Handles API communication and caching of domain scores

interface HostScoreMap {
  [hostname: string]: number;
}

// Store scores in the local storage
const storeScores = async (scores: HostScoreMap): Promise<void> => {
  const now = Date.now();
  const storedItems: {[key: string]: {score: number, timestamp: number}} = {};

  Object.entries(scores).forEach(([host, score]) => {
    storedItems[host] = { score, timestamp: now };
  });

  await chrome.storage.local.set(storedItems);
};

// Get scores from storage that haven't expired
const getStoredScores = async (hosts: string[]): Promise<HostScoreMap> => {
  const result = await chrome.storage.local.get(hosts);
  const validScores: HostScoreMap = {};
  const now = Date.now();
  const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

  hosts.forEach(host => {
    const item = result[host];
    if (item && (now - item.timestamp < CACHE_TTL)) {
      validScores[host] = item.score;
    }
  });

  return validScores;
};

// Fetch scores from the API
const fetchScoresFromAPI = async (hosts: string[]): Promise<HostScoreMap> => {
  if (!hosts.length) return {};

  try {
    const API_ENDPOINT = 'https://scam-protector.com/api/bulk-score';
    
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ hosts }),
    });

    if (!response.ok) {
      throw new Error(`API returned status: ${response.status}`);
    }

    const data = await response.json();
    return data as HostScoreMap;
  } catch (error) {
    console.error('Scam-Protector API error:', error);
    return {};
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
  if (message.action === 'getScores') {
    const { hosts } = message;
    
    // Process the request in an async function
    (async () => {
      try {
        // Check cache first
        const cachedScores = await getStoredScores(hosts);
        
        // Find which hosts are not in cache
        const missingHosts = hosts.filter(host => cachedScores[host] === undefined);
        
        if (missingHosts.length === 0) {
          // All scores were in cache
          sendResponse(cachedScores);
          return;
        }
        
        // Split into chunks of 100 to avoid hitting API limits
        const hostChunks = chunkArray(missingHosts, 100);
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
        console.error('Error processing score request:', error);
        sendResponse({});
      }
    })();
    
    // Return true to indicate we'll respond asynchronously
    return true;
  }
});