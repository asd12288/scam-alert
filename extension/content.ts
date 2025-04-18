// Scam-Protector Content Script
// Scans all links on a page and marks risky ones with visual cues

interface HostScoreMap {
  [hostname: string]: number;
}

// Cache for storing scores to avoid unnecessary API calls
const scoreCache = new Map<string, { score: number; timestamp: number }>();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes in milliseconds
const RISKY_THRESHOLD = 60; // Links with scores below 60 are marked as risky (aligned with app)
const VERY_RISKY_THRESHOLD = 30; // Links with scores below 30 are considered very risky

// Accessibility settings - can later be made configurable via options page
const ACCESSIBILITY = {
  largeText: true,            // Use larger text for warnings
  highContrast: false,        // Force high contrast mode
  verboseWarnings: true,      // Use more descriptive warnings
  animationReduced: false,    // Reduce animations for users who prefer reduced motion
};

// Extract unique hostnames from all links on the page
function extractHostnames(): string[] {
  const links = document.querySelectorAll("a[href]");
  const hostnames = new Set<string>();

  links.forEach((link) => {
    try {
      const href = link.getAttribute("href");
      if (!href) return;

      // Only process http/https links
      if (href.startsWith("http://") || href.startsWith("https://")) {
        const url = new URL(href);
        hostnames.add(url.hostname);
      }
    } catch (e) {
      // Skip invalid URLs
    }
  });

  return Array.from(hostnames);
}

// Get custom warning text based on risk level
function getWarningText(score: number): string {
  if (ACCESSIBILITY.verboseWarnings) {
    if (score < VERY_RISKY_THRESHOLD) {
      return "⚠️ WARNING: This website appears to be unsafe! High risk of scam or fraud. Avoid clicking.";
    } else {
      return "⚠️ CAUTION: This website has a low trust score and might be unsafe. Click with caution.";
    }
  } else {
    return "⚠️ Potential scam: low trust score";
  }
}

// Create a visual risk meter element
function createRiskMeter(score: number): HTMLDivElement {
  // Convert score to a risk percentage (0-100)
  // Where 100 score = 0% risk, 0 score = 100% risk
  const riskPercentage = 100 - score;

  // Create the risk meter container
  const riskMeter = document.createElement('div');
  riskMeter.className = 'sp-risk-meter';

  // Create the fill element that shows the risk level
  const riskFill = document.createElement('div');
  riskFill.className = 'sp-risk-meter-fill';
  riskFill.style.setProperty('--risk-level', `${riskPercentage}%`);

  // Create a marker at the 60% threshold (corresponds to our RISKY_THRESHOLD)
  const thresholdMarker = document.createElement('div');
  thresholdMarker.className = 'sp-risk-meter-marker';
  thresholdMarker.style.left = '40%'; // 100 - RISKY_THRESHOLD

  // Create a score value indicator
  const scoreValue = document.createElement('div');
  scoreValue.className = 'sp-risk-meter-value';
  scoreValue.textContent = `Score: ${score}/100`;
  scoreValue.style.left = `${100 - riskPercentage}%`;

  // Assemble the risk meter
  riskMeter.appendChild(riskFill);
  riskMeter.appendChild(thresholdMarker);
  riskMeter.appendChild(scoreValue);

  return riskMeter;
}

// Clear the extension's cache (for debugging)
async function clearScoresCache(): Promise<void> {
  try {
    // Clear local memory cache
    scoreCache.clear();
    
    // Clear storage cache via background script
    await chrome.runtime.sendMessage({
      action: 'getScores',
      clearCache: true
    });
    
    console.log('[Scam-Protector] Cache cleared successfully');
    
    // Re-scan the page with fresh data
    await scanPage();
  } catch (error) {
    console.error('[Scam-Protector] Failed to clear cache:', error);
  }
}

// Create debug UI control for testing
function addDebugControls(): void {
  // Only add in development environments or when debug parameter is present
  const isDebug = window.location.search.includes('sp-debug') || 
                  window.location.hostname === 'localhost' ||
                  window.location.hostname.includes('test');
  
  if (!isDebug) return;
  
  // Create debug panel
  const debugPanel = document.createElement('div');
  debugPanel.style.position = 'fixed';
  debugPanel.style.bottom = '10px';
  debugPanel.style.right = '10px';
  debugPanel.style.padding = '10px';
  debugPanel.style.background = 'rgba(0,0,0,0.8)';
  debugPanel.style.color = 'white';
  debugPanel.style.borderRadius = '5px';
  debugPanel.style.zIndex = '9999999';
  debugPanel.style.fontSize = '12px';
  debugPanel.style.fontFamily = 'Arial, sans-serif';
  
  // Add clear cache button
  const clearButton = document.createElement('button');
  clearButton.textContent = 'Clear Score Cache';
  clearButton.style.background = '#ff3333';
  clearButton.style.border = 'none';
  clearButton.style.color = 'white';
  clearButton.style.padding = '5px 10px';
  clearButton.style.borderRadius = '3px';
  clearButton.style.cursor = 'pointer';
  clearButton.addEventListener('click', clearScoresCache);
  
  // Add scan page button
  const scanButton = document.createElement('button');
  scanButton.textContent = 'Force Re-scan';
  scanButton.style.background = '#3333ff';
  scanButton.style.border = 'none';
  scanButton.style.color = 'white';
  scanButton.style.padding = '5px 10px';
  scanButton.style.marginLeft = '5px';
  scanButton.style.borderRadius = '3px';
  scanButton.style.cursor = 'pointer';
  scanButton.addEventListener('click', () => scanPage());
  
  // Add status output
  const statusDiv = document.createElement('div');
  statusDiv.textContent = 'Scam-Protector debug mode';
  statusDiv.style.marginTop = '5px';
  statusDiv.style.fontSize = '10px';
  
  // Assemble panel
  debugPanel.appendChild(clearButton);
  debugPanel.appendChild(scanButton);
  debugPanel.appendChild(statusDiv);
  document.body.appendChild(debugPanel);
}

// Mark links that match risky hostnames
function markRiskyLinks(scoreMap: HostScoreMap): void {
  const links = document.querySelectorAll("a[href]");

  links.forEach((link) => {
    try {
      const href = link.getAttribute("href");
      if (!href) return;

      if (href.startsWith("http://") || href.startsWith("https://")) {
        const url = new URL(href);
        const score = scoreMap[url.hostname];

        // Only process links with actual scores (avoid false positives)
        if (score !== undefined) {
          // Debug logging to help troubleshoot score issues
          console.debug(`Scam-Protector: ${url.hostname} has score ${score}`);

          if (score < RISKY_THRESHOLD) {
            link.classList.add("sp-danger");

            // Set custom warning message based on risk level
            const warningText = getWarningText(score);
            link.setAttribute("data-sp-warning", warningText);

            // Store the actual score as a data attribute for debugging
            link.setAttribute("data-sp-score", score.toString());

            // Add aria attributes for screen readers
            link.setAttribute("aria-description", warningText);

            // Add the visual risk meter
            const riskMeter = createRiskMeter(score);
            link.appendChild(riskMeter);

            // For very risky sites, add an additional visual indicator
            if (score < VERY_RISKY_THRESHOLD) {
              link.classList.add("sp-danger-badge");
            }

            // Apply accessibility settings
            if (ACCESSIBILITY.largeText) {
              link.style.setProperty("--sp-warning-font-size", "16px");
            }

            if (ACCESSIBILITY.highContrast) {
              link.classList.add("sp-high-contrast");
            }

            if (ACCESSIBILITY.animationReduced) {
              link.style.setProperty("--sp-animation", "none");
            }
          }
        }
      }
    } catch (e) {
      // Skip invalid URLs
    }
  });
}

// Get scores from cache or request from background script
async function getScoresForHosts(hostnames: string[]): Promise<HostScoreMap> {
  const now = Date.now();
  const cachedScores: HostScoreMap = {};
  const hostsToFetch: string[] = [];

  hostnames.forEach((hostname) => {
    const cached = scoreCache.get(hostname);
    if (cached && now - cached.timestamp < CACHE_TTL) {
      cachedScores[hostname] = cached.score;
    } else {
      hostsToFetch.push(hostname);
    }
  });

  if (hostsToFetch.length === 0) {
    return cachedScores;
  }

  try {
    const newScores: HostScoreMap = await chrome.runtime.sendMessage({
      action: "getScores",
      hosts: hostsToFetch,
    });

    Object.entries(newScores).forEach(([host, score]) => {
      scoreCache.set(host, { score, timestamp: now });
    });

    return { ...cachedScores, ...newScores };
  } catch (error) {
    console.warn("Scam-Protector: Failed to get scores", error);
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
  return function (this: any, ...args: Parameters<T>): void {
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
      if (mutation.type === "childList" || mutation.type === "attributes") {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "href"
        ) {
          shouldScan = true;
          break;
        }

        if (mutation.addedNodes.length > 0) {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.tagName === "A" || element.querySelector("a")) {
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
      if ("requestIdleCallback" in window) {
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
    attributeFilter: ["href"],
  });
}

// Read user's preferred accessibility settings if available
async function loadAccessibilitySettings() {
  try {
    const settings = await chrome.storage.sync.get("accessibility");
    if (settings.accessibility) {
      Object.assign(ACCESSIBILITY, settings.accessibility);
    }

    if (ACCESSIBILITY.largeText) {
      const style = document.createElement("style");
      style.textContent = `
        .sp-danger::before {
          font-size: 18px !important;
          padding: 10px 14px !important;
        }
      `;
      document.head.appendChild(style);
    }
  } catch (e) {
    console.warn("Scam-Protector: Could not load accessibility settings");
  }
}

// Initialize when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  loadAccessibilitySettings().then(() => {
    scanPage();
    observeDOMChanges();
    
    // Add debug controls if in test/dev environment
    setTimeout(addDebugControls, 1000);
  });
});

// Also scan when page is fully loaded (for images and dynamically loaded content)
window.addEventListener("load", () => {
  setTimeout(scanPage, 1000);
});
