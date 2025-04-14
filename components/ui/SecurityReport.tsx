import React, { useState } from "react";
import Score from "./Score";
import {
  AlertTriangle,
  Shield,
  ChevronDown,
  ChevronUp,
  ExternalLink,
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
    if (!summary) return { verdict: "", points: [] };

    const lines = summary.split("\n").filter((line) => line.trim() !== "");

    // First line is usually the summary statement
    const verdict = lines[0] || "";

    // Find all emoji bullet points
    const emojiPattern = /(🔴|🟠|🟡|🟢|✅|•)/;
    const points = lines
      .slice(1)
      .filter((line) => emojiPattern.test(line))
      .map((line) => line.trim());

    return { verdict, points };
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

  const securityStatus = isDangerous
    ? {
        emoji: "⛔",
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
      }
    : needsCaution
    ? {
        emoji: "⚠️",
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
      }
    : {
        emoji: "✅",
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
      };

  // Parse AI summary content
  const { verdict, points } = aiSummary
    ? extractContent(aiSummary)
    : { verdict: "", points: [] };

  return (
    <div
      className={`overflow-hidden rounded-lg shadow border ${
        isDangerous
          ? "border-red-300"
          : needsCaution
          ? "border-amber-300"
          : "border-gray-200"
      }`}
    >
      {/* Header with domain and score */}
      <div className="px-6 py-5 bg-white border-b border-gray-100 flex justify-between items-center">
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-gray-900">
              {domain}
            </span>
          </div>
          {securityStatus && (
            <div
              className={`mt-1 ${securityStatus.color} text-sm flex items-center`}
            >
              <span className="mr-1">{securityStatus.emoji}</span>
              {isDangerous
                ? "High risk detected"
                : needsCaution
                ? "Use caution"
                : "No risks detected"}
            </div>
          )}
        </div>
        <Score score={score} size="lg" />
      </div>

      {/* Simple AI Security Summary */}
      {aiSummary && (
        <div
          className={`p-6 ${securityStatus.bg} border-b ${securityStatus.border}`}
        >
          <div className="flex items-center mb-3">
            <Brain className="w-5 h-5 mr-2 text-blue-600" />
            <p className="font-medium text-gray-800 text-base">
              AI Security Analysis
            </p>
          </div>

          {/* Overall verdict */}
          {verdict && (
            <p className="text-gray-800 font-medium mb-4 text-base">
              {verdict}
            </p>
          )}

          {/* Bullet points with emojis */}
          {points.length > 0 && (
            <div className="space-y-3">
              {points.map((point, index) => (
                <div
                  key={index}
                  className="flex p-3 bg-white rounded-md border border-gray-100 shadow-sm"
                >
                  <div className="pr-3 text-lg">
                    {point.match(/(🔴|🟠|🟡|🟢|✅|•)/) || "•"}
                  </div>
                  <div className="text-gray-800">
                    {point.replace(/(🔴|🟠|🟡|🟢|✅|•\s*)/, "")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Collapsible Details Sections */}
      <div className="divide-y divide-gray-100">
        {/* Google Safe Browsing section */}
        <div>
          <button
            className="w-full p-4 text-left flex justify-between items-center focus:outline-none hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection("safeBrowsing")}
          >
            <div className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full mr-2 ${
                  isMalicious ? "bg-red-500" : "bg-green-500"
                }`}
              />
              <span className="font-medium text-gray-800">
                Google Safe Browsing
              </span>
            </div>
            {expandedSection === "safeBrowsing" ? (
              <ChevronUp size={16} className="text-gray-500" />
            ) : (
              <ChevronDown size={16} className="text-gray-500" />
            )}
          </button>

          {expandedSection === "safeBrowsing" && (
            <div className="p-4 text-sm bg-white">
              <div className="flex items-center mb-2">
                {isMalicious ? (
                  <>
                    <AlertTriangle size={14} className="text-red-500 mr-2" />
                    <span className="text-red-600 font-medium">
                      This domain is flagged as potentially malicious
                    </span>
                  </>
                ) : (
                  <>
                    <Shield size={14} className="text-green-500 mr-2" />
                    <span className="text-green-600 font-medium">
                      No threats detected
                    </span>
                  </>
                )}
              </div>

              {matches && matches.length > 0 && (
                <div className="mt-2 p-2 bg-red-50 rounded border border-red-100 text-xs text-red-700">
                  <p className="font-medium mb-1">Detected threats:</p>
                  <ul className="list-disc pl-4 space-y-1">
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
            <div className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full mr-2 ${
                  whoisRiskFactors.length > 0 ? "bg-amber-500" : "bg-gray-400"
                }`}
              />
              <span className="font-medium text-gray-800">
                Domain Information
              </span>
            </div>
            {expandedSection === "whois" ? (
              <ChevronUp size={16} className="text-gray-500" />
            ) : (
              <ChevronDown size={16} className="text-gray-500" />
            )}
          </button>

          {expandedSection === "whois" && (
            <div className="p-4 text-sm bg-white">
              {whoisData && Object.keys(whoisData).length > 0 ? (
                <div>
                  <div className="grid grid-cols-2 gap-y-2">
                    <div className="text-gray-500">Created:</div>
                    <div>{formatDate(whoisData.creationDate)}</div>

                    <div className="text-gray-500">Age:</div>
                    <div>
                      {whoisData.domainAge
                        ? `${whoisData.domainAge} days`
                        : "-"}
                    </div>

                    <div className="text-gray-500">Registrar:</div>
                    <div>{whoisData.registrar || "-"}</div>
                  </div>

                  {whoisRiskFactors.length > 0 && (
                    <div className="mt-3 p-3 bg-amber-50 rounded-md border border-amber-100 text-amber-800 text-xs">
                      <p className="font-medium mb-1">⚠️ Risk factors:</p>
                      <ul className="list-disc pl-4 space-y-1">
                        {whoisRiskFactors.map((factor, index) => (
                          <li key={index}>{factor}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-500 italic">
                  Unable to retrieve domain information
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pattern Analysis section */}
        {patternAnalysis.riskFactors.length > 0 && (
          <div>
            <button
              className="w-full p-4 text-left flex justify-between items-center focus:outline-none hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection("patternAnalysis")}
            >
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${
                    patternAnalysis.suspiciousScore > 15
                      ? "bg-amber-500"
                      : "bg-gray-400"
                  }`}
                />
                <span className="font-medium text-gray-800">
                  AI Pattern Analysis
                </span>
              </div>
              {expandedSection === "patternAnalysis" ? (
                <ChevronUp size={16} className="text-gray-500" />
              ) : (
                <ChevronDown size={16} className="text-gray-500" />
              )}
            </button>

            {expandedSection === "patternAnalysis" && (
              <div className="p-4 text-sm bg-white">
                <div className="p-3 bg-amber-50 rounded-md border border-amber-100 text-amber-800 text-xs">
                  <p className="font-medium mb-2">🔍 Our AI detected:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    {patternAnalysis.riskFactors.map((factor, index) => (
                      <li key={index}>{factor}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer with action links */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href={`https://www.google.com/search?q=${domain}+reviews+legitimate+or+scam`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm bg-white px-4 py-2 rounded border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ExternalLink size={14} className="mr-2" />
            Check reviews
          </a>

          <a
            href={`https://www.virustotal.com/gui/domain/${domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm bg-white px-4 py-2 rounded border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Shield size={14} className="mr-2" />
            Virus scan
          </a>

          {isDangerous && (
            <a
              href={`https://safebrowsing.google.com/safebrowsing/report_phish/?url=${domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm bg-red-50 text-red-600 px-4 py-2 rounded border border-red-200 hover:bg-red-100 transition-colors"
            >
              <AlertTriangle size={14} className="mr-2" />
              Report phishing
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecurityReport;
