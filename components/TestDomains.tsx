import React from "react";
import { Copy, CheckCircle2, AlertTriangle, Shield } from "lucide-react";

// Test domains for scam detection
export const testDomains = [
  // Google's test URLs (will be detected as malicious)
  {
    domain: "testsafebrowsing.appspot.com/apiv4/ANY_PLATFORM/MALWARE/URL/",
    description: "Google Safe Browsing test URL for MALWARE",
    expectedResult: "malicious",
    type: "test",
  },
  {
    domain:
      "testsafebrowsing.appspot.com/apiv4/ANY_PLATFORM/SOCIAL_ENGINEERING/URL/",
    description: "Google Safe Browsing test URL for PHISHING",
    expectedResult: "malicious",
    type: "test",
  },
  // Examples of common scam domain patterns
  {
    domain: "amaz0n-security-alert.com",
    description: "Typosquatting domain with altered brand name",
    expectedResult: "potentially malicious",
    type: "scam",
  },
  {
    domain: "netflix-subscription-renew.com",
    description: "Service name with account action keywords",
    expectedResult: "potentially malicious",
    type: "scam",
  },
  {
    domain: "apple-icloud-verification.net",
    description: "Tech brand with account verification terms",
    expectedResult: "potentially malicious",
    type: "scam",
  },
];

/**
 * This component displays a list of test domains in a modern, consistent design
 */
const TestDomains = () => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getIconForDomain = (type: string) => {
    switch (type) {
      case "scam":
        return <AlertTriangle size={16} className="text-amber-500" />;
      case "test":
        return <Shield size={16} className="text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div className="p-4 bg-blue-50 border-b border-gray-200">
        <h2 className="text-base font-medium text-gray-800 flex items-center">
          <Shield className="w-4 h-4 mr-2 text-blue-600" />
          Example Domains for Testing
        </h2>
      </div>

      <div className="grid grid-cols-1 divide-y divide-gray-200">
        {testDomains.map((item, index) => (
          <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start">
              <div className="flex items-start">
                <div className="mt-0.5 mr-2 flex-shrink-0">
                  {getIconForDomain(item.type || "")}
                </div>
                <div>
                  <div className="font-medium text-blue-600 text-sm mb-1">
                    {item.domain}
                  </div>
                  <div className="text-gray-600 text-xs">
                    {item.description}
                  </div>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(item.domain, index)}
                className="ml-2 p-1.5 rounded hover:bg-gray-100 transition-colors flex-shrink-0"
                title="Copy domain to clipboard"
              >
                {copiedIndex === index ? (
                  <CheckCircle2 size={16} className="text-green-500" />
                ) : (
                  <Copy size={16} className="text-gray-400" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-gray-50 text-xs text-gray-600 border-t border-gray-200 flex items-center justify-center">
        <Copy size={14} className="mr-1.5 text-gray-400" />
        Click the copy button and paste the domain into the scanner above
      </div>
    </div>
  );
};

export default TestDomains;
