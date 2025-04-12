import React from "react";

// Test domains for scam detection
export const testDomains = [
  // Google's test URLs (will be detected as malicious)
  {
    domain: "testsafebrowsing.appspot.com/apiv4/ANY_PLATFORM/MALWARE/URL/",
    description: "Google Safe Browsing test URL for MALWARE",
    expectedResult: "malicious",
  },
  {
    domain:
      "testsafebrowsing.appspot.com/apiv4/ANY_PLATFORM/SOCIAL_ENGINEERING/URL/",
    description: "Google Safe Browsing test URL for PHISHING",
    expectedResult: "malicious",
  },
  // Examples of common scam domain patterns
  {
    domain: "amaz0n-security-alert.com",
    description: "Typosquatting domain with altered brand name",
    expectedResult: "potentially malicious",
  },
  {
    domain: "netflix-subscription-renew.com",
    description: "Service name with account action keywords",
    expectedResult: "potentially malicious",
  },
  {
    domain: "apple-icloud-verification.net",
    description: "Tech brand with account verification terms",
    expectedResult: "potentially malicious",
  },
];

/**
 * This component displays a list of test domains in a minimalist design
 */
const TestDomains = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="border border-gray-200 dark:border-gray-800">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-medium">Test domains</h2>
      </div>

      <div>
        {testDomains.map((item, index) => (
          <div
            key={index}
            className="p-4 border-b border-gray-200 dark:border-gray-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            onClick={() => copyToClipboard(item.domain)}
            title="Click to copy domain"
          >
            <div className="font-medium text-blue-600 dark:text-blue-400 text-sm mb-1">
              {item.domain}
            </div>
            <div className="text-gray-700 dark:text-gray-300 text-xs">
              {item.description}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-gray-50 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700">
        Click on a domain to copy it to clipboard. Then paste it into the domain
        checker above.
      </div>
    </div>
  );
};

export default TestDomains;
