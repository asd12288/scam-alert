import React, { useState } from "react";
import Score from "./ui/Score";
import {
  AlertTriangle,
  Shield,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Bot,
  Info,
  AlertCircle,
  Zap,
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

interface ReportProps {
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

const Report = ({ score = 100, data }: ReportProps) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Add safe checking for data structure
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

  return (
    <div
      className={`bg-white rounded-lg shadow-lg overflow-hidden ${
        isDangerous
          ? "border-2 border-[rgb(255,77,79)]"
          : needsCaution
          ? "border-2 border-[rgb(250,173,20)]"
          : "border border-gray-200"
      }`}
    >
      {/* Header with domain info and score */}
      <div className="p-5 flex flex-col md:flex-row gap-6 border-b border-gray-100">
        <div className="flex-1">
          <h2 className="text-2xl font-medium text-gray-900">{domain}</h2>

          {/* Status indicator based on score */}
          {isDangerous && (
            <div className="mt-2 text-[rgb(255,77,79)] text-sm flex items-center font-medium">
              <AlertTriangle size={14} className="mr-1" />
              AI Scam Alert: High-risk indicators detected
            </div>
          )}

          {needsCaution && !isDangerous && (
            <div className="mt-2 text-[rgb(250,173,20)] text-sm flex items-center font-medium">
              <AlertCircle size={14} className="mr-1" />
              AI Scam Alert: Potential risk signals detected
            </div>
          )}

          {!needsCaution && (
            <div className="mt-2 text-[rgb(82,196,26)] text-sm flex items-center font-medium">
              <Shield size={14} className="mr-1" />
              AI Scam Alert: No suspicious activity detected
            </div>
          )}

          {/* AI Summary section */}
          {aiSummary && (
            <div className="mt-4 p-4 bg-[#f8f9ff] rounded-md border border-gray-200">
              <div className="flex items-center gap-1.5 mb-2 text-gray-800">
                <Brain size={16} className="text-blue-600" />
                <span className="text-sm font-medium">
                  AI SCAM DETECTION REPORT
                </span>
              </div>
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {aiSummary}
              </div>
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <Score score={score} />
        </div>
      </div>

      {/* Results sections */}
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
              <div className="p-5 pt-2 text-sm space-y-3 bg-[#fafafa] fade-in">
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
            <div className="p-5 pt-2 text-sm space-y-3 bg-[#fafafa] fade-in">
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
              ></div>
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
            <div className="p-5 pt-2 text-sm space-y-3 bg-[#fafafa] fade-in">
              {whoisData && Object.keys(whoisData).length > 0 ? (
                <>
                  <div className="grid grid-cols-2 gap-y-3 text-sm bg-white p-4 rounded-md border border-gray-200">
                    <div className="text-gray-500 font-medium">Registered:</div>
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

                    <div className="text-gray-500 font-medium">Registrar:</div>
                    <div className="text-gray-900">
                      {whoisData.registrar || "-"}
                    </div>

                    <div className="text-gray-500 font-medium">Registrant:</div>
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
        <div className="p-4 bg-gray-50 border-t border-gray-200">
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
        className={`p-4 border-t border-gray-200 ${
          isDangerous
            ? "bg-[#fff8f8]"
            : needsCaution
            ? "bg-[rgba(250,173,20,0.1)]"
            : "bg-[rgba(82,196,26,0.1)]"
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
  );
};

export default Report;
