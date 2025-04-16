import React, { useState, useEffect } from "react";
import Score from "./Score";
import {
  AlertTriangle,
  Shield,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Info,
  Brain,
  CheckCircle,
  XCircle,
  Clock,
  Copy,
  AlertOctagon,
  Image as ImageIcon,
  ExternalLink as LinkIcon,
  Lock,
  Database,
  Search,
  RefreshCw,
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
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "aiSummary"
  );
  const [copied, setCopied] = useState(false);
  const [showFullScreenshot, setShowFullScreenshot] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
  const searchCount =
    typeof data?.searchCount === "number" && !isNaN(data.searchCount)
      ? data.searchCount
      : 0;
  const isCached = data?.cached || false;

  // Format dates for better readability
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  const formatDomainAge = (age?: number) => {
    if (!age) return "-";
    const years = Math.floor(age / 365);
    const days = age % 365;
    return years > 0 ? `${years}y ${days}d` : `${days}d`;
  };

  const copyDomain = () => {
    navigator.clipboard.writeText(domain);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const handleRefresh = () => {
    if (onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      onRefresh();

      // Reset after a timeout in case the parent component doesn't handle it
      setTimeout(() => setIsRefreshing(false), 5000);
    }
  };

  // Determine severity based on score
  const isDangerous = score < 40;
  const needsCaution = score < 70;

  const securityStatus = isDangerous
    ? {
        icon: <XCircle className="w-3 h-3 mr-1" />,
        label: "High Risk",
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
      }
    : needsCaution
    ? {
        icon: <AlertTriangle className="w-3 h-3 mr-1" />,
        label: "Caution",
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
      }
    : {
        icon: <CheckCircle className="w-3 h-3 mr-1" />,
        label: "Safe",
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
      };

  // Extract bullet points from the AI summary
  const extractContent = (summary: string) => {
    if (!summary) return { verdict: "", points: [], recommendations: [] };

    const lines = summary.split("\n").filter((line) => line.trim() !== "");

    // First line is usually the summary statement
    const verdict = lines[0] || "";

    // Find all emoji bullet points
    const emojiPattern = /(🔴|🟠|🟡|🟢|✅|❌|⚠️|•|💡)/;
    const points = lines
      .slice(1)
      .filter((line) => emojiPattern.test(line) && !line.includes("💡"))
      .map((line) => line.trim());

    const recommendations = lines
      .slice(1)
      .filter((line) => line.includes("💡"))
      .map((line) => line.trim());

    return { verdict, points, recommendations };
  };

  // Parse AI summary content
  const { verdict, points, recommendations } = aiSummary
    ? extractContent(aiSummary)
    : { verdict: "", points: [], recommendations: [] };

  const getDomainAgeRisk = () => {
    if (!whoisData.domainAge) return "none";
    if (whoisData.domainAge < 30) return "high";
    if (whoisData.domainAge < 180) return "medium";
    return "low";
  };

  return (
    <div className="w-full max-w-3xl mx-auto overflow-hidden rounded-lg shadow-lg border border-gray-200">
      {/* Header with domain and score */}
      <div className="px-5 py-4 bg-white border-b border-gray-100 flex justify-between items-center">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-gray-900">
              {domain}
            </span>
            <button
              onClick={copyDomain}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              title="Copy domain"
            >
              {copied ? (
                <CheckCircle size={14} className="text-green-500" />
              ) : (
                <Copy size={14} />
              )}
            </button>
            <a
              href={`https://${domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 text-xs flex items-center"
              title="Visit website"
            >
              <LinkIcon size={12} className="mr-1" />
              Visit
            </a>

            {/* Add refresh button */}
            {onRefresh && (
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={`text-gray-500 hover:text-gray-700 text-xs flex items-center ml-2 ${
                  isRefreshing ? "opacity-50" : ""
                }`}
                title="Refresh analysis"
              >
                <RefreshCw
                  size={12}
                  className={`mr-1 ${isRefreshing ? "animate-spin" : ""}`}
                />
                {isRefreshing ? "Refreshing" : "Refresh"}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                isDangerous
                  ? "bg-red-100 text-red-800"
                  : needsCaution
                  ? "bg-amber-100 text-amber-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {securityStatus.icon}
              <span className="ml-1">{securityStatus.label}</span>
            </div>

            {/* Show search count */}
            {searchCount > 0 && (
              <div
                title="Number of times this domain has been checked"
                className="text-xs text-gray-500 flex items-center"
              >
                <Search className="w-3 h-3 mr-1" />
                <span>
                  {searchCount > 999 ? "999+" : searchCount}{" "}
                  {searchCount === 1 ? "search" : "searches"}
                </span>
              </div>
            )}

            {whoisData.domainAge !== undefined && (
              <div className="text-xs text-gray-500 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {formatDomainAge(whoisData.domainAge)}
              </div>
            )}
            <div
              className={`text-xs flex items-center ${
                ssl.valid ? "text-green-500" : "text-red-500"
              }`}
            >
              <Lock className="w-3 h-3 mr-1" />
              {ssl.valid ? "Secure" : "Not secure"}
            </div>
          </div>
        </div>
        <Score score={score} size="md" />
      </div>

      {/* Cached indicator */}
      {isCached && (
        <div className="bg-blue-50 text-blue-700 text-xs py-1 px-4 border-b border-blue-100 flex items-center justify-between">
          <span className="flex items-center">
            <Info className="w-3 h-3 mr-1" />
            This analysis was cached from a previous search
          </span>
          {onRefresh && (
            <button
              onClick={handleRefresh}
              className="text-blue-600 hover:text-blue-800 text-xs underline"
              disabled={isRefreshing}
            >
              Refresh
            </button>
          )}
        </div>
      )}

      {/* Compact layout with screenshot and AI summary side by side on larger screens */}
      <div className="md:flex border-b border-gray-200">
        {/* Screenshot - Smaller and more contained */}
        <div className="md:w-2/5 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 relative">
          {!screenshot ? (
            <div className="flex items-center justify-center p-4 h-28 bg-gray-100">
              <div className="text-gray-400 flex flex-col items-center">
                <ImageIcon size={20} className="mb-1" />
                <span className="text-[10px]">No preview</span>
              </div>
            </div>
          ) : (
            <div
              className="relative cursor-pointer"
              onClick={() => setShowFullScreenshot(true)}
            >
              <div className="overflow-hidden shadow-inner">
                <Image
                  src={screenshot}
                  alt={`Screenshot of ${domain}`}
                  className="w-full object-cover"
                  style={{ maxHeight: "140px" }}
                />
              </div>
              <div
                className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-gray-100 to-transparent"
                aria-hidden="true"
              ></div>
              <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs py-0.5 px-1.5 rounded-full">
                <div className="flex items-center">
                  <ImageIcon size={8} className="mr-0.5" />
                  <span className="text-[10px]">Preview</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AI Security Summary - More compact version */}
        <div className={`p-3 md:w-3/5 ${securityStatus.bg}`}>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <Brain className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
              <p className="font-medium text-gray-800 text-xs">
                Security Assessment
              </p>
            </div>
            <button
              className="flex items-center text-xs text-gray-500 hover:text-gray-700"
              onClick={() => toggleSection("aiSummary")}
            >
              {expandedSection === "aiSummary" ? (
                <>
                  <span className="text-[10px]">Less</span>{" "}
                  <ChevronUp size={12} className="ml-0.5" />
                </>
              ) : (
                <>
                  <span className="text-[10px]">More</span>{" "}
                  <ChevronDown size={12} className="ml-0.5" />
                </>
              )}
            </button>
          </div>

          {/* Overall verdict - always visible */}
          {verdict && <p className="text-gray-800 text-xs mb-1.5">{verdict}</p>}

          {/* Expanded content */}
          {expandedSection === "aiSummary" && (
            <div className="mt-2">
              {/* Risk points with emojis - Single column layout for more consistency */}
              {points.length > 0 && (
                <div className="grid grid-cols-1 gap-1.5 mb-2">
                  {points.map((point, index) => (
                    <div
                      key={index}
                      className="flex p-1.5 bg-white rounded-md border border-gray-100 shadow-sm"
                    >
                      <div className="pr-1.5 text-sm">
                        {point.match(/(🔴|🟠|🟡|🟢|✅|❌|⚠️|•)/) || "•"}
                      </div>
                      <div className="text-gray-700 text-xs">
                        {point.replace(/(🔴|🟠|🟡|🟢|✅|❌|⚠️|•\s*)/, "")}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div className="grid grid-cols-1 gap-1.5">
                  {recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="flex p-1.5 bg-blue-50 rounded-md border border-blue-100 shadow-sm"
                    >
                      <div className="pr-1.5 text-blue-500">💡</div>
                      <div className="text-gray-700 text-xs">
                        {rec.replace(/(🔴|🟠|🟡|🟢|✅|❌|⚠️|•|💡\s*)/, "")}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats Row - Updated to include more relevant info */}
      <div className="grid grid-cols-3 gap-2 p-3 bg-white border-b border-gray-200">
        <div className="flex flex-col items-center p-1.5 rounded-md border border-gray-100 bg-gray-50">
          <span className="text-[10px] text-gray-500 mb-0.5">Domain Age</span>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-xs">
              {formatDomainAge(whoisData.domainAge)}
            </span>
            {getDomainAgeRisk() !== "none" && (
              <span
                className={`px-1 py-0.5 text-[8px] font-medium rounded-sm ${
                  getDomainAgeRisk() === "high"
                    ? "bg-red-100 text-red-800"
                    : getDomainAgeRisk() === "medium"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {getDomainAgeRisk()}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center p-1.5 rounded-md border border-gray-100 bg-gray-50">
          <span className="text-[10px] text-gray-500 mb-0.5">Safety Check</span>
          <div className="flex items-center">
            {isMalicious ? (
              <span className="font-semibold text-red-600 flex items-center text-xs">
                <AlertOctagon className="w-3 h-3 mr-1" />
                Flagged
              </span>
            ) : (
              <span className="font-semibold text-green-600 flex items-center text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                Clear
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center p-1.5 rounded-md border border-gray-100 bg-gray-50">
          <span className="text-[10px] text-gray-500 mb-0.5">Registrar</span>
          <span
            className="font-semibold text-center truncate w-full text-xs"
            title={whoisData.registrar || "-"}
          >
            {whoisData.registrar || "Unknown"}
          </span>
        </div>
      </div>

      {/* Tabbed interface for details - Updated UI */}
      <div className="bg-white">
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-1.5 px-2 text-center text-xs font-medium flex items-center justify-center ${
              expandedSection === "whois"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => toggleSection("whois")}
          >
            <Database size={12} className="mr-1" />
            Domain Info
          </button>
          <button
            className={`flex-1 py-1.5 px-2 text-center text-xs font-medium flex items-center justify-center ${
              expandedSection === "safeBrowsing"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => toggleSection("safeBrowsing")}
          >
            <Shield size={12} className="mr-1" />
            Threats
          </button>
          {patternAnalysis.riskFactors.length > 0 && (
            <button
              className={`flex-1 py-1.5 px-2 text-center text-xs font-medium flex items-center justify-center ${
                expandedSection === "patternAnalysis"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => toggleSection("patternAnalysis")}
            >
              <AlertTriangle size={12} className="mr-1" />
              Patterns
            </button>
          )}
        </div>

        {/* WHOIS section - Better formatted */}
        {expandedSection === "whois" && (
          <div className="p-3 text-xs bg-white">
            {whoisData && Object.keys(whoisData).length > 0 ? (
              <div>
                <div className="grid grid-cols-2 gap-y-1.5">
                  <div className="text-gray-500">Created:</div>
                  <div>{formatDate(whoisData.creationDate)}</div>

                  <div className="text-gray-500">Age:</div>
                  <div>
                    {whoisData.domainAge ? `${whoisData.domainAge} days` : "-"}
                  </div>

                  <div className="text-gray-500">Registrar:</div>
                  <div className="truncate" title={whoisData.registrar || "-"}>
                    {whoisData.registrar || "-"}
                  </div>

                  {whoisData.registrantOrganization && (
                    <>
                      <div className="text-gray-500">Organization:</div>
                      <div
                        className="truncate"
                        title={whoisData.registrantOrganization}
                      >
                        {whoisData.registrantOrganization}
                      </div>
                    </>
                  )}

                  {whoisData.registrantCountry && (
                    <>
                      <div className="text-gray-500">Country:</div>
                      <div>{whoisData.registrantCountry}</div>
                    </>
                  )}

                  {whoisData.expirationDate && (
                    <>
                      <div className="text-gray-500">Expires:</div>
                      <div>{formatDate(whoisData.expirationDate)}</div>
                    </>
                  )}
                </div>

                {whoisRiskFactors.length > 0 && (
                  <div className="mt-2 p-2 bg-amber-50 rounded-md border border-amber-100 text-amber-800 text-xs">
                    <p className="font-medium mb-1 text-[10px]">
                      ⚠️ Risk factors:
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-[10px]">
                      {whoisRiskFactors.map((factor, index) => (
                        <li key={index}>{factor}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-500 italic text-[10px]">
                Unable to retrieve domain information
              </div>
            )}
          </div>
        )}

        {/* Google Safe Browsing section */}
        {expandedSection === "safeBrowsing" && (
          <div className="p-3 text-xs bg-white">
            <div className="flex items-center mb-1.5">
              {isMalicious ? (
                <>
                  <AlertTriangle size={12} className="text-red-500 mr-1.5" />
                  <span className="text-red-600 font-medium">
                    This domain is flagged as potentially malicious
                  </span>
                </>
              ) : (
                <>
                  <Shield size={12} className="text-green-500 mr-1.5" />
                  <span className="text-green-600 font-medium">
                    No threats detected
                  </span>
                </>
              )}
            </div>

            {matches && matches.length > 0 && (
              <div className="mt-1.5 p-2 bg-red-50 rounded border border-red-100 text-[10px] text-red-700">
                <p className="font-medium mb-1">Detected threats:</p>
                <ul className="list-disc pl-4 space-y-0.5">
                  {matches.map((match, index) => (
                    <li key={index}>
                      {match.threatType} ({match.platformType})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Add SSL information to the threats tab */}
            <div className="mt-2 p-2 rounded border bg-gray-50 border-gray-200">
              <div className="flex items-center mb-1">
                <Lock
                  size={10}
                  className={
                    ssl.valid ? "text-green-500 mr-1" : "text-red-500 mr-1"
                  }
                />
                <span
                  className={`font-medium ${
                    ssl.valid ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {ssl.valid
                    ? "Valid SSL Certificate"
                    : "Invalid or Missing SSL Certificate"}
                </span>
              </div>

              {ssl.valid && (
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] mt-1">
                  {ssl.issuer && (
                    <>
                      <div className="text-gray-500">Issuer:</div>
                      <div className="truncate" title={ssl.issuer}>
                        {ssl.issuer}
                      </div>
                    </>
                  )}

                  {ssl.daysRemaining !== undefined && (
                    <>
                      <div className="text-gray-500">Expires in:</div>
                      <div>{ssl.daysRemaining} days</div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pattern Analysis section */}
        {expandedSection === "patternAnalysis" &&
          patternAnalysis.riskFactors.length > 0 && (
            <div className="p-3 text-xs bg-white">
              <div className="p-2 bg-amber-50 rounded-md border border-amber-100 text-amber-800">
                <p className="font-medium mb-1 text-[10px]">
                  🔍 AI pattern analysis detected:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-[10px]">
                  {patternAnalysis.riskFactors.map((factor, index) => (
                    <li key={index}>{factor}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
      </div>

      {/* Full-size screenshot modal */}
      {showFullScreenshot && screenshot && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowFullScreenshot(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                setShowFullScreenshot(false);
              }}
            >
              <XCircle size={16} />
            </button>
            <img
              src={screenshot}
              alt={`Full screenshot of ${domain}`}
              className="w-full h-auto object-contain rounded"
            />
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs py-1 px-2 rounded">
              {domain}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityReport;
