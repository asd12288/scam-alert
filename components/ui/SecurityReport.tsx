import React, { useState } from "react";
import Score from "./Score";
import {
  AlertTriangle,
  Shield,
  ChevronDown,
  CheckCircle,
  XCircle,
  Clock,
  Copy,
  ExternalLink,
  Image as ImageIcon,
  Lock,
  ThumbsUp,
  ThumbsDown,
  Info,
  HelpCircle,
  Share2,
  Facebook,
  Twitter as XIcon,
  Linkedin,
  Instagram,
  Link as LinkIcon,
  Flag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
    specialEasterEgg?: boolean;
  };
  onRefresh?: () => void;
}

const SecurityReport: React.FC<SecurityReportProps> = ({
  score,
  data,
  onRefresh,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [fbShareTextCopied, setFbShareTextCopied] = useState(false);
  const isLowScore = score < 60;
  const isEasterEgg = data?.specialEasterEgg === true;

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
      return dateString;
    }
  };

  const formatDomainAge = (age?: number) => {
    if (!age) return "New";
    if (age < 30) return "Less than 1 month";
    if (age < 365) return `${Math.floor(age / 30)} months`;
    const years = Math.floor(age / 365);
    return `${years} ${years === 1 ? "year" : "years"}`;
  };

  const copyDomain = () => {
    navigator.clipboard.writeText(domain);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine risk level based on score
  const getRiskLevel = () => {
    if (score >= 80) return "Safe";
    if (score >= 60) return "Probably Safe";
    if (score >= 40) return "Caution";
    return "High Risk";
  };

  // Get color classes based on risk level
  const getRiskColors = () => {
    if (score >= 80)
      return {
        bgHeader: "bg-green-50",
        border: "border-green-200",
        text: "text-green-800",
        icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      };
    if (score >= 60)
      return {
        bgHeader: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-800",
        icon: <ThumbsUp className="w-6 h-6 text-blue-600" />,
      };
    if (score >= 40)
      return {
        bgHeader: "bg-yellow-50",
        border: "border-yellow-200",
        text: "text-yellow-800",
        icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
      };
    return {
      bgHeader: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      icon: <ThumbsDown className="w-6 h-6 text-red-600" />,
    };
  };

  const colors = getRiskColors();
  const riskLevel = getRiskLevel();

  // Extract key findings from AI summary
  const getKeyFindings = () => {
    if (!aiSummary) return [];

    const lines = aiSummary.split("\n").filter((line) => line.trim() !== "");

    // Extract bullet points with emojis
    const findings = lines
      .filter((line) => /^[•🔴🟠🟡🟢✅❌⚠️]/.test(line.trim()))
      .map((line) => line.trim().replace(/^[•🔴🟠🟡🟢✅❌⚠️]\s*/, ""));

    // Limit to the most important findings (max 3)
    return findings.slice(0, 3);
  };

  const keyFindings = getKeyFindings();

  // Get recommendations from AI summary
  const getRecommendations = () => {
    if (!aiSummary) return [];

    const lines = aiSummary.split("\n").filter((line) => line.trim() !== "");
    return lines
      .filter((line) => line.includes("💡"))
      .map((line) => line.trim().replace(/^💡\s*/, ""));
  };

  const recommendations = getRecommendations();

  // Simple verdict from the first line of AI summary
  const getVerdict = () => {
    if (!aiSummary) return "";
    const lines = aiSummary.split("\n").filter((line) => line.trim() !== "");
    return lines[0] || "";
  };

  // Sharing functionality
  const getShareUrl = () => {
    // Create a URL with the domain as a parameter
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    return `${baseUrl}/?domain=${encodeURIComponent(domain)}`;
  };

  const getShareTitle = () => {
    return `Security Report for ${domain}: ${riskLevel} (Score: ${score}/100)`;
  };

  const getShareDescription = () => {
    return `I just checked ${domain} using Scam Protector and found it's rated as "${riskLevel}" with a security score of ${score}/100. Check it yourself!`;
  };

  const shareToFacebook = () => {
    // Show instructions modal for Facebook since it doesn't support pre-filled text
    const shareText = getShareDescription();
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      getShareUrl()
    )}`;

    // Copy the text to clipboard first to make it easier for users
    navigator.clipboard
      .writeText(shareText)
      .then(() => {
        // After copying text to clipboard, show a small tooltip and open Facebook share dialog
        setFbShareTextCopied(true);
        setTimeout(() => setFbShareTextCopied(false), 3000);
        window.open(url, "_blank", "width=600,height=400");
      })
      .catch((err) => {
        // If clipboard fails, just open Facebook
        console.error("Failed to copy text: ", err);
        window.open(url, "_blank", "width=600,height=400");
      });
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      getShareDescription()
    )}&url=${encodeURIComponent(getShareUrl())}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareToLinkedin = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      getShareUrl()
    )}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareToInstagram = () => {
    // Instagram doesn't have a direct web sharing API like the others
    // Usually for Instagram, we'd advise users to take a screenshot and share manually
    // For now, we'll copy the link to clipboard and show instructions
    navigator.clipboard.writeText(getShareUrl());
    alert("Link copied! Open Instagram and paste it in a message or post.");
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(getShareUrl());
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <div
      id="security-report"
      className={`w-full max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden border ${isEasterEgg ? 'border-blue-500 shadow-blue-200' : 'border-gray-200'}`}
    >
      {/* Header with website info and risk level - Bigger design */}
      <div
        id="report-header"
        className={`px-5 py-5 ${isEasterEgg ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-300' : `${colors.bgHeader} border-b ${colors.border}`} flex flex-col justify-between gap-3`}
      >
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0">
              {isEasterEgg ? (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 p-2 shadow-md">
                  <Image
                    src="/easter-egg-shield.png"
                    width={36}
                    height={36}
                    alt="Scam Protector Shield"
                    className="animate-pulse"
                  />
                </div>
              ) : (
                React.cloneElement(colors.icon, { className: "w-8 h-8" })
              )}
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-gray-900 truncate max-w-[220px] sm:max-w-xs">
                  {domain}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyDomain}
                    className="text-gray-500 hover:text-gray-700"
                    title="Copy website address"
                  >
                    {copied ? (
                      <CheckCircle size={18} className="text-green-500" />
                    ) : (
                      <Copy size={18} />
                    )}
                  </button>
                  <a
                    href={`https://${domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                    title="Visit website (opens in new window)"
                  >
                    <ExternalLink size={16} className="mr-1" />
                    Visit
                  </a>
                </div>
              </div>
              <p className={`text-base font-medium mt-1 ${isEasterEgg ? 'text-blue-800' : colors.text}`}>
                {isEasterEgg ? (
                  <span className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-1.5" />
                    This is your trusted security tool!
                  </span>
                ) : (
                  <span>This website appears to be: {riskLevel}</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex-shrink-0">
            {isEasterEgg ? (
              <div className="bg-blue-600 text-white text-xl font-bold px-4 py-2 rounded-full border-2 border-blue-300 shadow-lg flex items-center justify-center">
                100%
                <span className="ml-1 text-yellow-300">★</span>
              </div>
            ) : (
              <Score
                score={score}
                size="md"
                showDescription={false}
                variant="badge"
              />
            )}
          </div>
        </div>

        {/* Enhanced Share Section in Header */}
        <div className="w-full">
          <div className="bg-white bg-opacity-75 rounded-lg py-2 px-3 shadow-sm border border-gray-200 flex items-center justify-between">
            <div className="flex items-center">
              <Share2 className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                Help others stay safe:
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={shareToFacebook}
                className="bg-[#1877F2] text-white p-2 rounded-full flex items-center justify-center hover:bg-opacity-80 transition-colors w-8 h-8 relative"
                aria-label="Share on Facebook"
                title="Share on Facebook"
              >
                <Facebook size={16} />
                {fbShareTextCopied && (
                  <div className="absolute bg-black text-white text-xs py-1 px-2 rounded -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap w-40 text-center">
                    Text copied for sharing!
                  </div>
                )}
              </button>
              <button
                onClick={shareToTwitter}
                className="bg-[#000000] text-white p-2 rounded-full flex items-center justify-center hover:bg-opacity-80 transition-colors w-8 h-8"
                aria-label="Share on X"
                title="Share on X"
              >
                <XIcon size={16} />
              </button>
              <button
                onClick={shareToLinkedin}
                className="bg-[#0077B5] text-white p-2 rounded-full flex items-center justify-center hover:bg-opacity-80 transition-colors w-8 h-8"
                aria-label="Share on LinkedIn"
                title="Share on LinkedIn"
              >
                <Linkedin size={16} />
              </button>
              <button
                onClick={shareToInstagram}
                className="bg-[#E4405F] text-white p-2 rounded-full flex items-center justify-center hover:bg-opacity-80 transition-colors w-8 h-8"
                aria-label="Share on Instagram"
                title="Share on Instagram"
              >
                <Instagram size={16} />
              </button>
              <button
                onClick={copyShareLink}
                className="bg-gray-200 text-gray-700 p-2 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors w-8 h-8 relative"
                aria-label="Copy link"
                title="Copy link to clipboard"
              >
                <LinkIcon size={16} />
                {linkCopied && (
                  <span className="absolute bg-black text-white text-xs py-1 px-2 rounded -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    Link copied!
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Easter egg message */}
      {isEasterEgg && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 px-5 py-4 border-y border-blue-200">
          <div className="flex gap-3 items-center">
            <div className="bg-blue-100 p-2.5 rounded-full">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-blue-800">You found our Easter egg!</h3>
              <p className="text-blue-700">
                Of course we rate ourselves 100/100. We're the good guys, after all!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Warning banner for low-scoring websites */}
      {isLowScore && !isEasterEgg && (
        <div className="bg-red-50 border-y border-red-200 p-4">
          <div className="flex items-start gap-3">
            <div className="bg-red-100 p-2 rounded-full">
              <Flag className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-red-800 mb-1">
                {score < 40
                  ? "Think this website is dangerous?"
                  : "Suspicious about this website?"}
              </h3>
              <p className="text-red-700 mb-3">
                {score < 40
                  ? "Have you been scammed by this website? Help protect others by reporting it."
                  : "If you've had a bad experience with this site, let us know so we can warn others."}
              </p>
              <Link
                href="/report"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white py-1.5 px-4 rounded-md font-medium transition-colors text-sm"
              >
                <Flag className="w-4 h-4" /> Report This Website
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main content area with simplified layout */}
      <div className="p-4">
        {/* Screenshot preview - Smaller and contained */}
        {screenshot && (
          <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
            <div className="relative h-36 sm:h-48 md:h-60">
              <Image
                src={screenshot}
                alt={`Screenshot of ${domain}`}
                className="object-cover"
                fill
                sizes="(max-width: 768px) 100vw, 600px"
              />
              <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs py-1 px-2 rounded">
                Preview
              </div>
            </div>
          </div>
        )}

        {/* Summary section with large, easy to read text */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-3">Summary</h3>
          <p className="text-lg text-gray-700 mb-4">{getVerdict()}</p>

          {/* Improved key findings styling with consistent icons */}
          {keyFindings.length > 0 && (
            <div className="mt-3">
              <h4 className="text-lg font-medium text-gray-800 mb-2">
                Key Findings:
              </h4>
              <ul className="space-y-3">
                {keyFindings.map((finding, index) => {
                  // Select icon and style based on score
                  let iconElement;
                  let bgClass;
                  let borderClass;

                  if (score >= 80) {
                    iconElement = (
                      <CheckCircle className="w-5 h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                    );
                    bgClass = "bg-emerald-50";
                    borderClass = "border-emerald-100";
                  } else if (score >= 60) {
                    iconElement = (
                      <ThumbsUp className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    );
                    bgClass = "bg-green-50";
                    borderClass = "border-green-100";
                  } else if (score >= 40) {
                    iconElement = (
                      <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                    );
                    bgClass = "bg-yellow-50";
                    borderClass = "border-yellow-100";
                  } else {
                    iconElement = (
                      <XCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    );
                    bgClass = "bg-red-50";
                    borderClass = "border-red-100";
                  }

                  return (
                    <li
                      key={index}
                      className={`p-3 rounded-lg flex items-start ${bgClass} border ${borderClass}`}
                    >
                      {iconElement}
                      <span className="text-base">{finding}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Simple stats in easy to read format */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Important Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Website Age */}
            <div
              className={`p-4 rounded-lg border ${
                whoisData.domainAge && whoisData.domainAge < 60
                  ? "border-yellow-200 bg-yellow-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex items-center mb-2">
                <Clock className="w-6 h-6 mr-2 text-gray-600" />
                <h4 className="text-lg font-medium text-gray-800">
                  Website Age
                </h4>
              </div>
              <p className="text-base text-gray-700">
                {formatDomainAge(whoisData.domainAge)}
                {whoisData.domainAge && whoisData.domainAge < 60 && (
                  <span className="block text-sm text-yellow-700 mt-1">
                    ⚠️ New websites may be riskier
                  </span>
                )}
              </p>
            </div>

            {/* Security Check */}
            <div
              className={`p-4 rounded-lg border ${
                isMalicious
                  ? "border-red-200 bg-red-50"
                  : "border-green-200 bg-green-50"
              }`}
            >
              <div className="flex items-center mb-2">
                <Shield className="w-6 h-6 mr-2 text-gray-600" />
                <h4 className="text-lg font-medium text-gray-800">
                  Security Check
                </h4>
              </div>
              <p className="text-base flex items-center">
                {isMalicious ? (
                  <>
                    <XCircle className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-red-700">Known threats detected</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-green-700">No known threats</span>
                  </>
                )}
              </p>
            </div>

            {/* HTTPS Security */}
            <div
              className={`p-4 rounded-lg border ${
                ssl.valid
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex items-center mb-2">
                <Lock className="w-6 h-6 mr-2 text-gray-600" />
                <h4 className="text-lg font-medium text-gray-800">
                  Connection Security
                </h4>
              </div>
              <p className="text-base flex items-center">
                {ssl.valid ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-green-700">Secure connection</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-red-700">Not secure</span>
                  </>
                )}
              </p>
            </div>

            {/* Registration Info */}
            <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
              <div className="flex items-center mb-2">
                <Info className="w-6 h-6 mr-2 text-gray-600" />
                <h4 className="text-lg font-medium text-gray-800">
                  Registration
                </h4>
              </div>
              <p className="text-base text-gray-700">
                {whoisData.registrantOrganization ||
                whoisData.registrantCountry ? (
                  <>
                    {whoisData.registrantOrganization && (
                      <span className="block">
                        {whoisData.registrantOrganization}
                      </span>
                    )}
                    {whoisData.registrantCountry && (
                      <span className="block">
                        {whoisData.registrantCountry}
                      </span>
                    )}
                  </>
                ) : (
                  "Information not available"
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Recommendations section */}
        {recommendations.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              What Should You Do?
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <ul className="space-y-3">
                {recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <HelpCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-base text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Expandable technical details section */}
        <div className="mt-6">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center justify-between w-full px-4 py-2 text-left text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            <span className="text-base font-medium">Technical Details</span>
            <ChevronDown
              className={`w-5 h-5 transform ${showDetails ? "rotate-180" : ""}`}
            />
          </button>

          {showDetails && (
            <div className="mt-2 p-4 border border-gray-200 rounded-lg text-sm">
              {/* WHOIS Details */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-800 mb-2">
                  Domain Information
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-gray-600">Created:</div>
                  <div>{formatDate(whoisData.creationDate)}</div>

                  <div className="text-gray-600">Expires:</div>
                  <div>{formatDate(whoisData.expirationDate)}</div>

                  <div className="text-gray-600">Registrar:</div>
                  <div className="break-words">
                    {whoisData.registrar || "Unknown"}
                  </div>

                  {whoisData.privacyProtected !== undefined && (
                    <>
                      <div className="text-gray-600">Privacy Protected:</div>
                      <div>{whoisData.privacyProtected ? "Yes" : "No"}</div>
                    </>
                  )}
                </div>
              </div>

              {/* Security Details */}
              <div>
                <h4 className="font-medium text-gray-800 mb-2">
                  Security Details
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-gray-600">SSL Valid:</div>
                  <div>{ssl.valid ? "Yes" : "No"}</div>

                  {ssl.valid && ssl.issuer && (
                    <>
                      <div className="text-gray-600">SSL Issuer:</div>
                      <div className="break-words">{ssl.issuer}</div>
                    </>

                  )}

                  {isMalicious && matches && matches.length > 0 && (
                    <>
                      <div className="text-gray-600">Threat Types:</div>
                      <div>
                        <ul className="list-disc pl-4">
                          {matches.map((match, index) => (
                            <li key={index}>
                              {match.threatType} ({match.platformType})
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}

                  {patternAnalysis.riskFactors.length > 0 && (
                    <>
                      <div className="text-gray-600 col-span-2 mt-2 mb-1">
                        AI-Detected Patterns:
                      </div>
                      <div className="col-span-2">
                        <ul className="list-disc pl-4">
                          {patternAnalysis.riskFactors.map((factor, index) => (
                            <li key={index}>{factor}</li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Need help section */}
        <div className="mt-6">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="flex items-center justify-between w-full px-4 py-2 text-left text-gray-700 bg-blue-50 rounded-lg hover:bg-blue-100 border border-blue-200"
          >
            <span className="text-base font-medium">
              Need Help Understanding This Report?
            </span>
            <ChevronDown
              className={`w-5 h-5 transform ${showHelp ? "rotate-180" : ""}`}
            />
          </button>

          {showHelp && (
            <div className="mt-2 p-4 border border-blue-200 rounded-lg bg-blue-50">
              <h4 className="font-medium text-gray-800 mb-2">
                Understanding This Security Report
              </h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>
                    The <strong>safety score</strong> (out of 100) shows how
                    safe the website likely is. Higher is better.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>
                    <strong>Website age</strong> matters because scammers often
                    use new websites.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>
                    The <strong>security check</strong> tells you if this
                    website has been reported for harmful content.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>
                    <strong>Connection security</strong> shows if the website
                    uses proper encryption to protect your information.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium mr-2">•</span>
                  <span>
                    If you're unsure about a website, always follow the
                    recommendations in this report.
                  </span>
                </li>
              </ul>

              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="font-medium text-yellow-800">Need more help?</p>
                <p className="text-gray-700">
                  If you're still unsure about this website, consider asking a
                  trusted friend or family member to review it with you before
                  sharing any personal information or making purchases.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecurityReport;
