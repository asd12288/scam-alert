import React, { useState } from "react";
import Score from "./Score";
import {
  AlertTriangle,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Copy,
  AlertOctagon,
  Image as ImageIcon,
  ExternalLink as LinkIcon,
  Lock,
  Calendar,
  MapPin,
  Briefcase,
  Info,
  X,
} from "lucide-react";
import Image from "next/image";

interface WhoisData {
  domainName?: string;
  creationDate?: string;
  expirationDate?: string;
  registrar?: string;
  registrantName?: string;
  registrantOrganization?: string;
  registrantCountry?: string;
  domainAge?: number;
  nameServers?: string[];
  privacyProtected?: boolean;
}

interface SecurityReportProps {
  score: number;
  data: {
    domain: string;
    aiSummary?: string;
    details: {
      safeBrowsing?: {
        isMalicious?: boolean;
        matches?: any[] | null;
        score?: number;
      };
      whois?: {
        data?: WhoisData;
        riskFactors?: string[];
        score?: number;
      };
      patternAnalysis?: {
        riskFactors: string[];
        suspiciousScore: number;
      };
      ssl?: {
        valid: boolean;
        issuer?: string;
        daysRemaining?: number;
      };
      error?: boolean;
      message?: string;
      analysisDate?: string;
    };
    screenshot?: string;
    searchCount?: number;
    cached?: boolean;
  };
  onRefresh?: () => void;
}

const SecurityReport: React.FC<SecurityReportProps> = ({
  score,
  data,
  onRefresh,
}) => {
  const [copied, setCopied] = useState(false);
  const [showFullScreenshot, setShowFullScreenshot] = useState(false);

  // Extract data safely
  const domain = data?.domain || "Unknown domain";
  const aiSummary = data?.aiSummary;
  const screenshot = data?.screenshot;
  const isMalicious = data?.details?.safeBrowsing?.isMalicious || false;
  const matches = data?.details?.safeBrowsing?.matches || [];
  const whoisData = data?.details?.whois?.data || {};
  const whoisRiskFactors = data?.details?.whois?.riskFactors || [];
  const patternAnalysis = data?.details?.patternAnalysis || {
    riskFactors: [],
    suspiciousScore: 0,
  };
  const ssl = data?.details?.ssl || { valid: false };

  // Format dates for better readability
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return "Unknown";
    }
  };

  const formatDomainAge = (age?: number) => {
    if (!age) return "New";
    const years = Math.floor(age / 365);
    const months = Math.floor((age % 365) / 30);
    
    if (years > 0) {
      return years === 1 ? "1 year" : `${years} years`;
    } else if (months > 0) {
      return months === 1 ? "1 month" : `${months} months`;
    } else {
      return "Less than 1 month";
    }
  };

  const copyDomain = () => {
    navigator.clipboard.writeText(domain);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine security level
  const getSecurityLevel = () => {
    if (score >= 80) return "VERY SAFE";
    if (score >= 70) return "SAFE";
    if (score >= 60) return "MODERATE";
    if (score >= 40) return "CAUTION";
    if (score >= 20) return "WARNING";
    return "DANGER";
  };

  // Determine color scheme based on score
  const getColorScheme = () => {
    if (score >= 80) return { bg: "bg-green-50", text: "text-green-800", border: "border-green-200", icon: <CheckCircle className="w-6 h-6" /> };
    if (score >= 60) return { bg: "bg-yellow-50", text: "text-yellow-800", border: "border-yellow-200", icon: <AlertTriangle className="w-6 h-6" /> };
    return { bg: "bg-red-50", text: "text-red-800", border: "border-red-200", icon: <XCircle className="w-6 h-6" /> };
  };

  const colorScheme = getColorScheme();
  const securityLevel = getSecurityLevel();

  // Split AI summary into sections
  const parseSummary = (summary?: string) => {
    if (!summary) return { overall: "", risks: [], advice: [] };
    
    const lines = summary.split("\n").filter(line => line.trim());
    const overall = lines[0] || "";
    
    const risks = lines.filter(line => 
      line.includes("❌") || 
      line.includes("⚠️") || 
      line.includes("🔴") || 
      line.includes("🟠")
    );
    
    const advice = lines.filter(line => 
      line.includes("💡") || 
      line.includes("✅") || 
      line.includes("🟢")
    );
    
    return { overall, risks, advice };
  };

  const { overall, risks, advice } = parseSummary(aiSummary);

  // Check if domain is new (less than 6 months)
  const isNewDomain = whoisData.domainAge ? whoisData.domainAge < 180 : false;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border">
      {/* Domain Header */}
      <div className="bg-gray-50 border-b p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <div className="text-lg sm:text-xl font-bold text-gray-800">{domain}</div>
              <div className="flex items-center gap-3 mt-1">
                <button 
                  onClick={copyDomain} 
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                >
                  <Copy size={14} />
                  {copied ? "Copied!" : "Copy"}
                </button>
                <a 
                  href={`https://${domain}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                >
                  <LinkIcon size={14} />
                  Visit Site
                </a>
              </div>
            </div>
          </div>

          <Score score={score} size="lg" className="min-w-[120px]" />
        </div>
      </div>

      {/* Main Security Summary Panel */}
      <div className={`${colorScheme.bg} ${colorScheme.border} border-b p-4 sm:p-6`}>
        <div className="flex items-center gap-3 mb-4">
          {colorScheme.icon}
          <h2 className={`text-xl sm:text-2xl font-bold ${colorScheme.text}`}>
            {securityLevel}
          </h2>
        </div>
        
        <div className="text-gray-700 text-base sm:text-lg mb-4">
          {overall || `This website has been analyzed and given a security score of ${score}/100.`}
        </div>

        {/* Key Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {/* Domain Age */}
          <div className="bg-white rounded-lg border p-3 flex items-center">
            <Calendar className="w-6 h-6 mr-3 text-gray-500" />
            <div>
              <div className="text-sm text-gray-500">Domain Age</div>
              <div className="font-semibold flex items-center">
                {formatDomainAge(whoisData.domainAge)}
                {isNewDomain && (
                  <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">New</span>
                )}
              </div>
            </div>
          </div>

          {/* SSL Security */}
          <div className="bg-white rounded-lg border p-3 flex items-center">
            <Lock className={`w-6 h-6 mr-3 ${ssl.valid ? "text-green-500" : "text-red-500"}`} />
            <div>
              <div className="text-sm text-gray-500">Connection</div>
              <div className={`font-semibold ${ssl.valid ? "text-green-600" : "text-red-600"}`}>
                {ssl.valid ? "Secure (HTTPS)" : "Not Secure"}
              </div>
            </div>
          </div>

          {/* Safety Check */}
          <div className="bg-white rounded-lg border p-3 flex items-center">
            <Shield className={`w-6 h-6 mr-3 ${isMalicious ? "text-red-500" : "text-green-500"}`} />
            <div>
              <div className="text-sm text-gray-500">Safety Check</div>
              <div className={`font-semibold ${isMalicious ? "text-red-600" : "text-green-600"}`}>
                {isMalicious ? "Threats Detected" : "No Threats Found"}
              </div>
            </div>
          </div>
        </div>

        {/* Screenshot Preview */}
        {screenshot && (
          <div className="bg-white rounded-lg border overflow-hidden mb-4">
            <div className="bg-gray-100 border-b p-2 text-sm font-medium flex items-center">
              <ImageIcon className="w-4 h-4 mr-2 text-gray-500" />
              Website Preview
            </div>
            <div 
              className="relative cursor-pointer overflow-hidden max-h-[200px]"
              onClick={() => setShowFullScreenshot(true)}
            >
              <Image 
                src={screenshot} 
                alt={`Screenshot of ${domain}`}
                width={800}
                height={600}
                className="w-full object-cover"
                style={{ maxHeight: "200px", objectPosition: "top" }}
              />
              <div 
                className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent"
                aria-hidden="true"
              ></div>
              <div className="absolute bottom-2 right-2 bg-blue-600 text-white text-xs py-1 px-2 rounded">
                Click to enlarge
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Risk Factors */}
      {(risks.length > 0 || matches.length > 0 || whoisRiskFactors.length > 0 || patternAnalysis.riskFactors.length > 0) && (
        <div className="border-b p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
            Risk Factors
          </h3>

          <div className="space-y-4">
            {/* AI-detected risks */}
            {risks.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-bold text-red-700 mb-2">AI Analysis Detected:</h4>
                <ul className="space-y-2">
                  {risks.map((risk, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-2">
                        {risk.match(/(❌|⚠️|🔴|🟠)/) || "⚠️"}
                      </span>
                      <span className="text-gray-700">
                        {risk.replace(/(❌|⚠️|🔴|🟠)\s*/, "")}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Google Safe Browsing Threats */}
            {matches.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-bold text-red-700 mb-2">Security Threats Detected:</h4>
                <ul className="space-y-2">
                  {matches.map((match, index) => (
                    <li key={index} className="flex items-start">
                      <AlertOctagon className="w-4 h-4 text-red-500 mr-2 mt-0.5" />
                      <span className="text-gray-700">
                        {match.threatType} threat detected ({match.platformType})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* WHOIS Risk Factors */}
            {whoisRiskFactors.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-bold text-yellow-700 mb-2">Domain Registration Concerns:</h4>
                <ul className="space-y-2">
                  {whoisRiskFactors.map((factor, index) => (
                    <li key={index} className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2 mt-0.5" />
                      <span className="text-gray-700">{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pattern Analysis Risk Factors */}
            {patternAnalysis.riskFactors.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-bold text-yellow-700 mb-2">Suspicious Patterns:</h4>
                <ul className="space-y-2">
                  {patternAnalysis.riskFactors.map((factor, index) => (
                    <li key={index} className="flex items-start">
                      <Info className="w-4 h-4 text-yellow-500 mr-2 mt-0.5" />
                      <span className="text-gray-700">{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Safety Recommendations */}
      {advice.length > 0 && (
        <div className="border-b p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-500" />
            Safety Recommendations
          </h3>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <ul className="space-y-3">
              {advice.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">
                    {item.match(/(💡|✅|🟢)/) || "💡"}
                  </span>
                  <span className="text-gray-700">
                    {item.replace(/(💡|✅|🟢)\s*/, "")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Domain Details */}
      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold mb-4">Domain Details</h3>

        <div className="bg-gray-50 rounded-lg border overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-500">Created On:</span>
                <p className="font-medium">{formatDate(whoisData.creationDate)}</p>
              </div>
              
              {whoisData.expirationDate && (
                <div>
                  <span className="text-sm text-gray-500">Expires On:</span>
                  <p className="font-medium">{formatDate(whoisData.expirationDate)}</p>
                </div>
              )}
              
              {whoisData.registrar && (
                <div>
                  <span className="text-sm text-gray-500">Registrar:</span>
                  <p className="font-medium">{whoisData.registrar}</p>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              {whoisData.registrantOrganization && (
                <div>
                  <span className="text-sm text-gray-500">Organization:</span>
                  <p className="font-medium">{whoisData.registrantOrganization}</p>
                </div>
              )}
              
              {whoisData.registrantCountry && (
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-1">Country:</span>
                  <p className="font-medium flex items-center">
                    <MapPin size={14} className="mr-1 text-gray-500" />
                    {whoisData.registrantCountry}
                  </p>
                </div>
              )}
              
              {ssl.issuer && (
                <div>
                  <span className="text-sm text-gray-500">SSL Issuer:</span>
                  <p className="font-medium truncate" title={ssl.issuer}>
                    {ssl.issuer}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full-size screenshot modal */}
      {showFullScreenshot && screenshot && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowFullScreenshot(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full bg-white p-2 rounded-lg">
            <button
              className="absolute top-3 right-3 bg-gray-200 text-gray-800 p-1 rounded-full z-10"
              onClick={(e) => {
                e.stopPropagation();
                setShowFullScreenshot(false);
              }}
            >
              <X size={20} />
            </button>
            <img
              src={screenshot}
              alt={`Full screenshot of ${domain}`}
              className="w-full h-auto object-contain rounded"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-70 text-white py-2 px-4 rounded text-center">
              Screenshot of {domain} - Click anywhere to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityReport;
