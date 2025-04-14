import React, { useState } from "react";
import Score from "./Score";
import {
  AlertTriangle,
  Shield,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Bot,
  Info,
  AlertCircle,
  Brain,
} from "lucide-react";

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
      error?: boolean;
      message?: string;
      analysisDate?: string;
    };
  };
}

const SecurityReport: React.FC<SecurityReportProps> = ({ score, data }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Extract data safely
  const domain = data?.domain || "Unknown domain";
  const aiSummary = data?.aiSummary;
  const isMalicious = data?.details?.safeBrowsing?.isMalicious || false;
  const hasError = data?.details?.error || false;
  const matches = data?.details?.safeBrowsing?.matches || [];
  const whoisData = data?.details?.whois?.data || {};
  const whoisRiskFactors = data?.details?.whois?.riskFactors || [];
  const patternAnalysis = data?.details?.patternAnalysis || {
    riskFactors: [],
    suspiciousScore: 0,
  };

  // Format dates for better readability
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  // Extract bullet points from the AI summary
  const extractContent = (summary: string) => {
    const lines = summary.split("\n").filter((line) => line.trim() !== "");

    // First line is usually the summary statement
    const overallVerdict = lines[0];

    // Remaining lines are bullet points
    const bulletPoints = lines
      .slice(1)
      .filter(
        (line) =>
          line.includes("•") ||
          line.includes("🔴") ||
          line.includes("🟠") ||
          line.includes("🟡") ||
          line.includes("🟢") ||
          line.includes("✅")
      )
      .map((line) => line.trim());

    return { overallVerdict, bulletPoints };
  };

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  // Determine severity based on score
  const isDangerous = score < 40;
  const needsCaution = score < 70;
  const isSuspicious = patternAnalysis.suspiciousScore > 15;

  // Combine all risk factors for display
  const allRiskFactors = [
    ...(whoisRiskFactors || []),
    ...(patternAnalysis.riskFactors || []),
  ];

  // Get appropriate styling based on score
  const getScoreTheme = () => {
    if (score >= 80)
      return {
        bg: "bg-green-50",
        accent: "bg-green-500",
        text: "text-green-700",
        border: "border-green-200",
      };
    if (score >= 60)
      return {
        bg: "bg-blue-50",
        accent: "bg-blue-500",
        text: "text-blue-700",
        border: "border-blue-200",
      };
    if (score >= 40)
      return {
        bg: "bg-yellow-50",
        accent: "bg-yellow-500",
        text: "text-yellow-700",
        border: "border-yellow-200",
      };
    return {
      bg: "bg-red-50",
      accent: "bg-red-500",
      text: "text-red-700",
      border: "border-red-200",
    };
  };

  const theme = getScoreTheme();

  // Parse AI summary content if available
  const { overallVerdict, bulletPoints } = aiSummary
    ? extractContent(aiSummary)
    : {
        overallVerdict: "Security assessment complete.",
        bulletPoints: [],
      };

  // Function to get appropriate emoji background color
  const getEmojiBg = (emoji: string) => {
    if (emoji.includes("🔴")) return "bg-red-100";
    if (emoji.includes("🟠")) return "bg-orange-100";
    if (emoji.includes("🟡")) return "bg-yellow-100";
    if (emoji.includes("🟢") || emoji.includes("✅")) return "bg-green-100";
    return "bg-gray-100";
  };

  return (
    <div
      className={`overflow-hidden rounded-xl shadow-lg border ${
        isDangerous
          ? "border-2 border-[rgb(255,77,79)]"
          : needsCaution
          ? "border-2 border-[rgb(250,173,20)]"
          : "border-gray-200"
      }`}
    >
      {/* Header with domain and score */}
      <div className={`px-6 py-5 ${theme.bg} border-b ${theme.border}`}>
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full ${theme.accent} mr-2`}
              ></div>
              <h2 className="text-xl font-semibold text-gray-900">{domain}</h2>
            </div>

            {/* Status indicators based on score */}
            {isDangerous && (
              <p className="text-sm text-[rgb(255,77,79)] mt-2 flex items-center">
                <AlertTriangle size={14} className="mr-1" />
                High-risk indicators detected
              </p>
            )}

            {needsCaution && !isDangerous && (
              <p className="text-sm text-[rgb(250,173,20)] mt-2 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                Potential risk signals detected
              </p>
            )}

            {!needsCaution && (
              <p className="text-sm text-[rgb(82,196,26)] mt-2 flex items-center">
                <Shield size={14} className="mr-1" />
                No suspicious activity detected
              </p>
            )}
          </div>
          <Score score={score} size="md" />
        </div>
      </div>

      {/* Report content */}
      <div className="bg-white p-6">
        {/* AI Summary section */}
        {aiSummary && (
          <div className="mb-6">
            <div className="flex items-center gap-1.5 mb-2 text-gray-800">
              <Brain size={16} className="text-blue-600" />
              <span className="text-sm font-medium">AI SECURITY ANALYSIS</span>
            </div>

            {/* Verdict summary in a highlighted box */}
            <div className={`p-4 rounded-lg ${theme.bg} mb-4`}>
              <p className={`${theme.text} font-medium`}>{overallVerdict}</p>
            </div>

            {/* Key findings in a modern card layout */}
            {bulletPoints.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">
                  Key Findings
                </h3>

                <div className="space-y-3">
                  {bulletPoints.map((point, index) => {
                    const emoji = point.includes("🔴")
                      ? "🔴"
                      : point.includes("🟠")
                      ? "🟠"
                      : point.includes("🟡")
                      ? "🟡"
                      : point.includes("🟢")
                      ? "🟢"
                      : point.includes("✅")
                      ? "✅"
                      : "•";

                    const pointText = point.replace(/^[•🔴🟠🟡🟢✅]\s*/, "");
                    const emojiBg = getEmojiBg(emoji);

                    return (
                      <div
                        key={index}
                        className={`flex items-center p-4 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 transition-colors`}
                      >
                        <div
                          className={`${emojiBg} w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0`}
                        >
                          <span>{emoji}</span>
                        </div>
                        <span className="text-gray-700">{pointText}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Collapsible Details Sections */}
        <div className="divide-y divide-gray-100 text-black">
          {/* Pattern Analysis section */}
          {patternAnalysis.riskFactors.length > 0 && (
            <div>
              <button
                className="w-full p-4 text-left flex justify-between items-center focus:outline-none hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection("patternAnalysis")}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      isSuspicious ? "bg-[rgb(250,173,20)]" : "bg-gray-400"
                    }`}
                  >
                    {isSuspicious ? (
                      <AlertTriangle size={10} className="text-white" />
                    ) : (
                      <Info size={10} className="text-white" />
                    )}
                  </div>
                  <span className="font-medium text-gray-900">
                    AI Pattern Analysis
                  </span>
                </div>
                {expandedSection === "patternAnalysis" ? (
                  <ChevronUp size={18} className="text-gray-500" />
                ) : (
                  <ChevronDown size={18} className="text-gray-500" />
                )}
              </button>

              {expandedSection === "patternAnalysis" && (
                <div className="p-5 pt-2 text-sm space-y-3 bg-[#fafafa]">
                  <p className="text-gray-700">
                    {isSuspicious
                      ? "Our advanced AI algorithms detected suspicious patterns in this domain name."
                      : "Our intelligent AI analysis found some patterns worth noting in this domain name."}
                  </p>

                  <div
                    className={`mt-3 p-3 rounded-md border ${
                      isSuspicious
                        ? "bg-[rgba(250,173,20,0.1)] border-[rgba(250,173,20,0.3)] text-[rgb(194,120,3)]"
                        : "bg-gray-50 border-gray-200 text-gray-700"
                    }`}
                  >
                    <p className="font-medium mb-2">AI-detected patterns:</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {patternAnalysis.riskFactors.map((factor, index) => (
                        <li key={index}>{factor}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Google Safe Browsing section */}
          <div>
            <button
              className="w-full p-4 text-left flex justify-between items-center focus:outline-none hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection("safeBrowsing")}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    isMalicious ? "bg-[rgb(255,77,79)]" : "bg-[rgb(82,196,26)]"
                  }`}
                >
                  {isMalicious ? (
                    <AlertTriangle size={10} className="text-white" />
                  ) : (
                    <Shield size={10} className="text-white" />
                  )}
                </div>
                <span className="font-medium text-gray-900">
                  Google Safe Browsing
                </span>
              </div>
              {expandedSection === "safeBrowsing" ? (
                <ChevronUp size={18} className="text-gray-500" />
              ) : (
                <ChevronDown size={18} className="text-gray-500" />
              )}
            </button>

            {expandedSection === "safeBrowsing" && (
              <div className="p-5 pt-2 text-sm space-y-3 bg-[#fafafa]">
                <p className="text-gray-700">
                  {hasError
                    ? "Unable to check this domain with Google Safe Browsing."
                    : isMalicious
                    ? "This domain is flagged as potentially malicious."
                    : "No threats detected by Google Safe Browsing."}
                </p>

                {matches && matches.length > 0 && (
                  <div className="mt-3 p-3 bg-[#fff8f8] rounded-md border border-[rgba(255,77,79,0.3)]">
                    <p className="font-medium text-[rgb(255,77,79)]">
                      Detected threats:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-[rgb(255,77,79)] text-xs">
                      {matches.map((match, index) => (
                        <li key={index}>
                          {match.threatType} ({match.platformType})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* WHOIS section */}
          <div>
            <button
              className="w-full p-4 text-left flex justify-between items-center focus:outline-none hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection("whois")}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full ${
                    whoisRiskFactors.length > 0
                      ? "bg-[rgb(250,173,20)]"
                      : "bg-gray-400"
                  }`}
                >
                  <span className="sr-only">Status indicator</span>
                </div>
                <span className="font-medium text-gray-900">
                  Domain Information
                </span>
              </div>
              {expandedSection === "whois" ? (
                <ChevronUp size={18} className="text-gray-500" />
              ) : (
                <ChevronDown size={18} className="text-gray-500" />
              )}
            </button>

            {expandedSection === "whois" && (
              <div className="p-5 pt-2 text-sm space-y-3 bg-[#fafafa]">
                {whoisData && Object.keys(whoisData).length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 gap-y-3 text-sm bg-white p-4 rounded-md border border-gray-200">
                      <div className="text-gray-500 font-medium">
                        Registered:
                      </div>
                      <div className="text-gray-900">
                        {formatDate(whoisData.creationDate)}
                      </div>

                      <div className="text-gray-500 font-medium">Expires:</div>
                      <div className="text-gray-900">
                        {formatDate(whoisData.expirationDate)}
                      </div>

                      <div className="text-gray-500 font-medium">Age:</div>
                      <div className="text-gray-900">
                        {whoisData.domainAge
                          ? `${whoisData.domainAge} days`
                          : "-"}
                      </div>

                      <div className="text-gray-500 font-medium">
                        Registrar:
                      </div>
                      <div className="text-gray-900">
                        {whoisData.registrar || "-"}
                      </div>

                      <div className="text-gray-500 font-medium">
                        Registrant:
                      </div>
                      <div className="text-gray-900">
                        {whoisData.registrantName ||
                          whoisData.registrantOrganization ||
                          "-"}
                      </div>

                      <div className="text-gray-500 font-medium">
                        Privacy Protected:
                      </div>
                      <div className="text-gray-900">
                        {whoisData.privacyProtected ? "Yes" : "No"}
                      </div>
                    </div>

                    {whoisRiskFactors.length > 0 && (
                      <div className="mt-3 p-3 bg-[rgba(250,173,20,0.1)] text-[rgb(194,120,3)] text-sm rounded-md border border-[rgba(250,173,20,0.3)]">
                        <div className="font-medium mb-1 flex items-center">
                          <AlertTriangle size={14} className="mr-1" />
                          Risk factors:
                        </div>
                        <ul className="list-disc pl-5 space-y-1">
                          {whoisRiskFactors.map((factor, index) => (
                            <li key={index}>{factor}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-700 bg-white p-4 rounded-md border border-gray-200">
                    Unable to retrieve WHOIS information for this domain.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Summary of risk factors */}
        {allRiskFactors.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Summary of Concerns:
            </h3>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              {allRiskFactors.slice(0, 3).map((factor, index) => (
                <li key={index}>{factor}</li>
              ))}
              {allRiskFactors.length > 3 && (
                <li className="text-gray-500 italic">
                  {allRiskFactors.length - 3} more risk factors detected...
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Footer with action links */}
        <div
          className={`mt-6 p-4 rounded-lg border ${
            isDangerous
              ? "bg-[#fff8f8] border-[rgba(255,77,79,0.3)]"
              : needsCaution
              ? "bg-[rgba(250,173,20,0.05)] border-[rgba(250,173,20,0.3)]"
              : "bg-[rgba(82,196,26,0.05)] border-[rgba(82,196,26,0.3)]"
          }`}
        >
          <div className="flex flex-wrap gap-3">
            <a
              href={`https://www.google.com/search?q=${domain}+reviews+legitimate+or+scam`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-gray-700 hover:text-gray-900 font-medium"
            >
              <ExternalLink size={14} className="mr-1.5" />
              Check reviews
            </a>

            <a
              href={`https://www.virustotal.com/gui/domain/${domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-gray-700 hover:text-gray-900 font-medium"
            >
              <Shield size={14} className="mr-1.5" />
              VirusTotal scan
            </a>

            {isDangerous && (
              <a
                href={`https://safebrowsing.google.com/safebrowsing/report_phish/?url=${domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-[rgb(255,77,79)] hover:text-[rgb(255,30,30)] font-medium"
              >
                <AlertTriangle size={14} className="mr-1.5" />
                Report as phishing
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityReport;
