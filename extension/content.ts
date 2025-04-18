// Scam-Protector Content Script
// Scans all links on a page and marks risky ones with visual cues

interface HostScoreMap {
  [hostname: string]: number;
}

// Cache for storing scores to avoid unnecessary API calls
const scoreCache = new Map<string, { score: number; timestamp: number }>();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes in milliseconds
const RISKY_THRESHOLD = 40; // Links with scores below this are marked as risky

// Extract unique hostnames from all links on the page
function extractHostnames(): string[] {
  const links = document.querySelectorAll('a[href]');
  const hostnames = new Set<string>();

  links.forEach(link => {
    try {
      const href = link.getAttribute('href');
      if (!href) return;

      // Only process http/https links
      if (href.startsWith('http://') || href.startsWith('https://')) {
        const url = new URL(href);
        hostnames.add(url.hostname);
      }
    } catch (e) {
      // Skip invalid URLs
    }
  });

  return Array.from(hostnames);
}

// Mark links that match risky hostnames
function markRiskyLinks(scoreMap: HostScoreMap): void {
  const links = document.querySelectorAll('a[href]');

  links.forEach(link => {
    try {
      const href = link.getAttribute('href');
      if (!href) return;

      if (href.startsWith('http://') || href.startsWith('https://')) {
        const url = new URL(href);
        const score = scoreMap[url.hostname];
        
        if (score !== undefined && score < RISKY_THRESHOLD) {
          link.classList.add('sp-danger');
        }
      }
    } catch (e) {
      // Skip invalid URLs
    }
  });
}

// Get scores from cache or request from background script
async function getScoresForHosts(hostnames: string[]): Promise<HostScoreMap> {
  // Filter out hostnames that are already in the cache and still valid
  const now = Date.now();
  const cachedScores: HostScoreMap = {};
  const hostsToFetch: string[] = [];

  hostnames.forEach(hostname => {
    const cached = scoreCache.get(hostname);
    if (cached && now - cached.timestamp < CACHE_TTL) {
      cachedScores[hostname] = cached.score;
    } else {
      hostsToFetch.push(hostname);
    }
  });

  // If no hosts need fetching, return cached results
  if (hostsToFetch.length === 0) {
    return cachedScores;
  }

  try {
    // Request scores from background script
    const newScores: HostScoreMap = await chrome.runtime.sendMessage({
      action: 'getScores',
      hosts: hostsToFetch
    });

    // Cache the new scores
    Object.entries(newScores).forEach(([host, score]) => {
      scoreCache.set(host, { score, timestamp: now });
    });

    // Merge cached and new scores
    return { ...cachedScores, ...newScores };
  } catch (error) {
    console.warn('Scam-Protector: Failed to get scores', error);
    return cachedScores;
  }
}

// Main function to scan page, get scores, and mark risky links
async function scanPage(): Promise<void> {
  const hostnames = extractHostnames();
  if (hostnames.length === 0) return;

  const scoreMap = await getScoresForHosts(hostnames);
  markRiskyLinks(scoreMap);
}

// Throttle function to avoid performance issues
function throttle<T extends (...args: any[]) => any>(
  func: T, 
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return function(this: any, ...args: Parameters<T>): void {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// Set up mutation observer to detect new links
function observeDOMChanges(): void {
  const throttledScan = throttle(scanPage, 1000);
  
  const observer = new MutationObserver((mutations) => {
    let shouldScan = false;
    
    for (const mutation of mutations) {
      if (mutation.type === 'childList' || mutation.type === 'attributes') {
        if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
          shouldScan = true;
          break;
        }
        
        if (mutation.addedNodes.length > 0) {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.tagName === 'A' || element.querySelector('a')) {
                shouldScan = true;
                break;
              }
            }
          }
        }
      }
      
      if (shouldScan) break;
    }
    
    if (shouldScan) {
      // Use requestIdleCallback if available, otherwise use setTimeout
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => throttledScan());
      } else {
        setTimeout(() => throttledScan(), 100);
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['href']
  });
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initial scan
  scanPage();
  
  // Observe DOM for changes
  observeDOMChanges();
});

// Also scan when page is fully loaded (for images and dynamically loaded content)
window.addEventListener('load', () => {
  setTimeout(scanPage, 1000);
});