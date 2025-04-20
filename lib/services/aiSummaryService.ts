import OpenAI from "openai";

// Initialize OpenAI client with environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY_PERSONAL,
});

// List of well-known trusted domains
const TRUSTED_DOMAINS: Record<string, string> = {
  // Major search engines
  "google.com":
    "Google is one of the world's most trusted technology companies and search engines. This domain is extremely safe and legitimate.",
  "bing.com":
    "Bing is Microsoft's search engine and a highly trusted domain. It is completely safe to use.",
  "yahoo.com":
    "Yahoo is a well-established web service provider with a long history. This domain is legitimate and safe.",
  "duckduckgo.com":
    "DuckDuckGo is a privacy-focused search engine with a strong reputation for security. This domain is safe.",

  // Major social platforms
  "facebook.com":
    "Facebook is one of the world's largest social media platforms. This domain is legitimate and operated by Meta Platforms, Inc.",
  "instagram.com":
    "Instagram is a popular social media platform owned by Meta Platforms, Inc. This domain is legitimate and safe.",
  "twitter.com":
    "Twitter (X) is a major social media platform. This domain is legitimate and safe to use.",
  "linkedin.com":
    "LinkedIn is the world's largest professional network, owned by Microsoft. This domain is legitimate and secure.",
  "youtube.com":
    "YouTube is the world's largest video sharing platform, owned by Google. This domain is legitimate and safe.",

  // Major e-commerce
  "amazon.com":
    "Amazon is one of the world's largest e-commerce companies. This domain is legitimate and safe for online shopping.",
  "ebay.com":
    "eBay is a well-established online marketplace. This domain is legitimate and safe for transactions.",
  "walmart.com":
    "Walmart is a major retail corporation. This domain is their official website and is safe to use.",
  "target.com":
    "Target is a major retail corporation. This domain is their official website and is safe to use.",

  // Major tech companies
  "microsoft.com":
    "Microsoft is one of the world's largest technology companies. This domain is extremely safe and legitimate.",
  "apple.com":
    "Apple is one of the world's most valuable technology companies. This domain is their official website and is completely safe.",
  "ibm.com":
    "IBM is one of the world's oldest and most established technology companies. This domain is legitimate and safe.",
  "intel.com":
    "Intel is a leading semiconductor manufacturer. This domain is legitimate and safe.",
  "adobe.com":
    "Adobe is a major software company known for creative and document tools. This domain is legitimate and safe.",

  // Major financial services
  "paypal.com":
    "PayPal is a trusted online payment system. This domain is legitimate and secure for financial transactions.",
  "visa.com":
    "Visa is one of the world's largest payment networks. This domain is legitimate and safe.",
  "mastercard.com":
    "Mastercard is one of the world's largest payment networks. This domain is legitimate and safe.",
  "chase.com":
    "Chase is a major US banking institution. This domain is legitimate and secure for banking services.",
  "bankofamerica.com":
    "Bank of America is a major US banking institution. This domain is legitimate and secure for banking services.",

  // Major cloud providers
  "aws.amazon.com":
    "Amazon Web Services (AWS) is the world's largest cloud provider. This domain is legitimate and secure.",
  "cloud.google.com":
    "Google Cloud is a major cloud computing service. This domain is legitimate and secure.",
  "azure.microsoft.com":
    "Microsoft Azure is a major cloud computing platform. This domain is legitimate and secure.",

  // Major educational platforms
  "wikipedia.org":
    "Wikipedia is the world's largest free online encyclopedia. This domain is legitimate and safe.",
  "github.com":
    "GitHub is the world's leading software development platform. This domain is legitimate and safe for developers.",
  "stackoverflow.com":
    "Stack Overflow is a trusted platform for programmers. This domain is legitimate and safe.",

  // Government domains
  "usa.gov":
    "USA.gov is the official portal of the United States government. This domain is legitimate and secure.",
  "irs.gov":
    "IRS.gov is the official website of the Internal Revenue Service. This domain is legitimate and secure.",
  "cdc.gov":
    "CDC.gov is the official website of the Centers for Disease Control and Prevention. This domain is legitimate.",
  "who.int":
    "WHO.int is the official website of the World Health Organization. This domain is legitimate and trustworthy.",

  // News organizations
  "nytimes.com":
    "The New York Times is one of the world's most respected news organizations. This domain is legitimate.",
  "bbc.com":
    "BBC is the British Broadcasting Corporation, a trusted global news source. This domain is legitimate.",
  "cnn.com":
    "CNN is a major global news network. This domain is legitimate and safe.",
  "reuters.com":
    "Reuters is one of the world's largest news agencies. This domain is legitimate and trustworthy.",
};

// Phrases to describe trusted domains for more variation in responses
const TRUSTED_PHRASES = [
  "is a trusted and legitimate website",
  "is considered very safe",
  "is a well-established and reliable site",
  "has an excellent security reputation",
  "is known to be secure and trustworthy",
  "is a reputable website",
  "poses no security concerns",
  "has a strong safety track record",
  "is widely recognized as legitimate",
  "is completely safe to use",
  "is a legitimate service provider",
  "maintains high security standards",
  "is verified as safe",
  "is a verified and trusted domain",
  "has all the hallmarks of a legitimate site",
  "ranks highly in our security assessment",
  "is on our list of trusted domains",
  "can be used with confidence",
  "has proven itself to be reliable",
  "meets all security best practices",
];

// Conversation starters to make responses more natural
const CONVERSATION_STARTERS = [
  "Based on our analysis, ",
  "Good news! ",
  "You'll be glad to know that ",
  "I can confirm that ",
  "No concerns here. ",
  "This is a trustworthy site. ",
  "You're in good hands with ",
  "This is a legitimate website. ",
  "I'm happy to report that ",
  "You can trust ",
];

interface SafeBrowsingMatch {
  threatType: string;
  platformType: string;
  threat: {
    url: string;
  };
  cacheDuration: string;
  threatEntryType: string;
}

// Update the SecurityData interface to include SSL info
interface SecurityData {
  domain: string;
  score: number;
  safeBrowsing?: {
    isMalicious?: boolean;
    matches?: SafeBrowsingMatch[];
  };
  whois?: {
    data?: {
      domainAge?: number;
      creationDate?: string;
      expirationDate?: string;
      registrar?: string;
      registrantName?: string;
      registrantOrganization?: string;
      privacyProtected?: boolean;
    };
    riskFactors?: string[];
  };
  ssl?: {
    valid: boolean;
    daysRemaining?: number;
    validFrom?: string;
    validTo?: string;
    issuer?: string;
    validForHost?: boolean;
    error?: boolean;
    message?: string;
  };
}

/**
 * Normalizes a domain name for comparison
 */
function normalizeDomain(domain: string): string {
  let normalized = domain.replace(/^https?:\/\//, "");
  normalized = normalized.replace(/^www\./, "");
  normalized = normalized.split("/")[0];
  normalized = normalized.split(":")[0];
  return normalized.toLowerCase();
}

/**
 * Checks if a domain is trusted
 */
function checkTrustedDomain(
  domain: string
): { baseDomain: string; description: string } | null {
  const normalizedDomain = normalizeDomain(domain);

  if (TRUSTED_DOMAINS[normalizedDomain]) {
    return {
      baseDomain: normalizedDomain,
      description: TRUSTED_DOMAINS[normalizedDomain],
    };
  }

  for (const trustedDomain of Object.keys(TRUSTED_DOMAINS)) {
    if (normalizedDomain.endsWith(`.${trustedDomain}`)) {
      return {
        baseDomain: trustedDomain,
        description: `This appears to be a subdomain of ${trustedDomain}. ${TRUSTED_DOMAINS[trustedDomain]}`,
      };
    }
  }

  return null;
}

/**
 * Generates a natural response for trusted domains
 */
function generateTrustedDomainResponse(domainInfo: {
  baseDomain: string;
  description: string;
}): string {
  const starter =
    CONVERSATION_STARTERS[
      Math.floor(Math.random() * CONVERSATION_STARTERS.length)
    ];
  const trustedPhrase =
    TRUSTED_PHRASES[Math.floor(Math.random() * TRUSTED_PHRASES.length)];
  const { baseDomain, description } = domainInfo;
  const firstSentence = description.split(".")[0] + ".";

  const responseType = Math.floor(Math.random() * 5);
  switch (responseType) {
    case 0:
      return `${starter}${description}`;
    case 1:
      return `${starter}${baseDomain} ${trustedPhrase}. ${firstSentence}`;
    case 2:
      return `${starter}this is ${baseDomain}, which ${trustedPhrase}. ${firstSentence}`;
    case 3:
      return `${baseDomain} ${trustedPhrase}. ${starter.toLowerCase()}${firstSentence}`;
    case 4:
      return `I can confirm that ${baseDomain} is safe. ${firstSentence} This is a domain you can trust.`;
    default:
      return `${starter}${description}`;
  }
}

/**
 * Creates a prompt for the LLM based on security data
 */
function createSecurityPrompt(data: SecurityData): string {
  const { domain, score, safeBrowsing, whois, ssl } = data;

  const isNewDomain = whois?.data?.domainAge && whois.data.domainAge < 90;
  const hasPrivacyProtection = whois?.data?.privacyProtected;

  let prompt = `Provide a SHORT security assessment for "${domain}" with a safety score of ${score}/100. FORMAT YOUR RESPONSE WITH:
  
1. A one-sentence overall verdict about safety
2. 2-4 bullet points with key findings, using emoji indicators (🔴 high risk, 🟠 medium risk, 🟡 low risk, 🟢 positive factor)

Key information:
- Domain type: ${domain.split(".").pop() || "unknown"}
- Google Safe Browsing: ${
    safeBrowsing?.isMalicious
      ? "❗ FLAGGED AS MALICIOUS"
      : "✓ No threats detected"
  }`;

  if (ssl) {
    prompt += `\n- SSL Certificate: ${
      ssl.valid ? "✓ Valid" : "❗ Invalid or missing"
    }`;

    if (ssl.valid && ssl.daysRemaining !== undefined) {
      prompt += ` (${ssl.daysRemaining} days remaining${
        ssl.issuer ? `, issued by ${ssl.issuer}` : ""
      })`;

      if (ssl.daysRemaining < 30) {
        prompt += `\n- ❗ RISK FACTOR: SSL certificate expires soon (${ssl.daysRemaining} days)`;
      } else if (ssl.daysRemaining > 180) {
        prompt += `\n- POSITIVE FACTOR: SSL certificate has long validity`;
      }
    }

    if (!ssl.valid) {
      prompt += `\n- ❗ RISK FACTOR: Invalid or missing SSL certificate`;
    }
  }

  if (whois?.data) {
    prompt += `\n- Domain age: ${
      whois.data.domainAge ? `${whois.data.domainAge} days` : "Unknown"
    }`;

    if (isNewDomain) {
      prompt += `\n- ❗ RISK FACTOR: New domain (${whois.data.domainAge} days old)`;
    }
    if (hasPrivacyProtection) {
      prompt += `\n- ❗ RISK FACTOR: Privacy protection used`;
    }
  }

  if (whois?.riskFactors && whois.riskFactors.length > 0) {
    prompt += `\n- Additional risks: ${whois.riskFactors.join(", ")}`;
  }

  prompt += `\n\nResponse must be under 75 words total. Use simple language.`;

  return prompt;
}

/**
 * Generates an AI summary of security findings
 */
export async function generateAISummary(data: SecurityData): Promise<string> {
  try {
    const { domain } = data;
    const trustedDomainInfo = checkTrustedDomain(domain);

    if (trustedDomainInfo) {
      return generateTrustedDomainResponse(trustedDomainInfo);
    }

    const prompt = createSecurityPrompt(data);

    const response = await openai.chat.completions.create({
      model: "gpt-4-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a cybersecurity assistant providing VERY CONCISE domain security assessments. Format responses with a brief verdict sentence followed by 2-4 bullet points with emoji indicators. Keep total response under 75 words. Use plain language for non-technical users.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 150,
      temperature: 0.5,
      response_format: { type: "text" },
    });

    return (
      response.choices[0]?.message?.content?.trim() ||
      generateFallbackSummary(data)
    );
  } catch (error) {
    console.error("Error generating AI summary:", error);
    return generateFallbackSummary(data);
  }
}

/**
 * Fallback summary generator when AI is not available
 */
function generateFallbackSummary(data: SecurityData): string {
  const { domain, score, safeBrowsing, whois, ssl } = data;

  const trustedDomainInfo = checkTrustedDomain(domain);
  if (trustedDomainInfo) {
    return generateTrustedDomainResponse(trustedDomainInfo);
  }

  const isNewDomain = whois?.data?.domainAge && whois.data.domainAge < 90;
  const hasPrivacyProtection = whois?.data?.privacyProtected;
  const isMalicious = safeBrowsing?.isMalicious || false;
  const hasInvalidSSL = ssl && !ssl.valid;
  const sslExpiringSoon =
    ssl?.valid && ssl.daysRemaining !== undefined && ssl.daysRemaining < 30;

  const bullets = [];

  if (isMalicious) {
    bullets.push("🔴 Flagged as potentially malicious by Google Safe Browsing");
  }

  if (hasInvalidSSL) {
    bullets.push(
      "🔴 Missing or invalid SSL certificate (connection not secure)"
    );
  } else if (sslExpiringSoon) {
    bullets.push(
      `🟠 SSL certificate expires soon (${ssl?.daysRemaining} days remaining)`
    );
  } else if (ssl?.valid) {
    bullets.push("🟢 Valid SSL certificate (secure connection)");
  }

  if (isNewDomain) {
    bullets.push(`🟠 New domain: only ${whois?.data?.domainAge} days old`);
  }

  if (hasPrivacyProtection) {
    bullets.push("🟡 Uses privacy protection (owner details hidden)");
  }

  if (whois?.riskFactors && whois.riskFactors.length > 0) {
    bullets.push(`🟠 ${whois.riskFactors[0]}`);
  }

  if (bullets.length === 0) {
    bullets.push("✅ No significant security issues detected");
  }

  if (whois?.data?.domainAge && whois.data.domainAge > 365) {
    bullets.push("🟢 Domain has been registered for over a year");
  }

  let verdict;
  if (score < 40) {
    verdict = `This domain appears unsafe with a low score of ${score}/100.`;
  } else if (score < 60) {
    verdict = `This domain requires caution with a score of ${score}/100.`;
  } else if (score < 80) {
    verdict = `This domain appears generally trustworthy (${score}/100).`;
  } else {
    verdict = `This domain has a good security rating of ${score}/100.`;
  }

  return `${verdict}\n\n${bullets.join("\n")}`;
}

/**
 * Advanced domain analysis function
 */
export function analyzeDomainName(domain: string) {
  const domainWithoutTLD = domain.split(".")[0];

  const popularBrands = [
    "netflix",
    "amazon",
    "apple",
    "microsoft",
    "google",
    "facebook",
    "instagram",
    "paypal",
    "bank",
  ];

  const suspiciousTerms = [
    "secure",
    "login",
    "signin",
    "account",
    "verify",
    "update",
    "billing",
    "support",
  ];

  const riskFactors = [];

  for (const brand of popularBrands) {
    if (domainWithoutTLD.includes(brand)) {
      for (const term of suspiciousTerms) {
        if (domainWithoutTLD.includes(term)) {
          riskFactors.push(
            `Contains brand "${brand}" with suspicious term "${term}"`
          );
          break;
        }
      }

      if (domainWithoutTLD.includes("-")) {
        riskFactors.push(
          `Contains brand "${brand}" with hyphens, which is unusual for legitimate brand domains`
        );
      }

      break;
    }
  }

  if (domainWithoutTLD.length > 20) {
    riskFactors.push(
      "Domain name is unusually long, which is common in phishing domains"
    );
  }

  if (/\d/.test(domainWithoutTLD)) {
    riskFactors.push(
      "Domain contains numbers, which can indicate typosquatting"
    );
  }

  const hyphenCount = (domainWithoutTLD.match(/-/g) || []).length;
  if (hyphenCount >= 2) {
    riskFactors.push(
      "Domain contains multiple hyphens, which is unusual for legitimate domains"
    );
  }

  return {
    riskFactors,
    suspiciousScore: Math.min(riskFactors.length * 15, 50),
  };
}
