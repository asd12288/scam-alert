import type { Metadata } from "next";
import { Metadata as DynamicMetadata, ResolvingMetadata } from "next";

// This file provides dynamic metadata for the security report page
// When someone shares a link with ?domain=example.com, this will enhance the Open Graph tags

export async function generateMetadata(
  { params, searchParams }: { params: any; searchParams: { domain?: string } },
  parent: ResolvingMetadata
): Promise<DynamicMetadata> {
  // Get the domain from search params
  const domain = searchParams.domain;
  
  // If no domain, return default metadata
  if (!domain) {
    return {
      title: "Check Website Security - Scam Protector",
      description: "Scan any website for potential security risks and scams in seconds with Scam Protector's advanced security tools.",
    };
  }

  // If a domain is provided, try to get data for better sharing
  try {
    // Format the domain for display without any potential query params
    const cleanDomain = domain.split('/')[0];
    
    // We could fetch the score here from the API if needed
    // For now, we'll just use the domain
    
    const title = `Security Report for ${cleanDomain} - Scam Protector`;
    const description = `See the detailed security analysis of ${cleanDomain}. Check if it's safe or potentially risky with Scam Protector's security tools.`;
    
    // Enhance the OG metadata for better social sharing experience
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `/?domain=${encodeURIComponent(cleanDomain)}`,
        siteName: "Scam Protector",
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Check Website Security - Scam Protector",
      description: "Scan any website for potential security risks and scams in seconds.",
    };
  }
}

export const metadata: Metadata = {
  title: "Scam Protector - Detect Online Scams Instantly",
  description:
    "Free tool to instantly check if a website is a potential scam, phishing attempt, or malicious site. Stay protected online with Scam Protector.",
  keywords: [
    "website scanner",
    "scam detector",
    "phishing protection",
    "fraud prevention",
    "online safety tool",
    "website security check",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Scam Protector - Free Online Scam Detection",
    description:
      "Check if a website is a potential scam in seconds. Protect yourself from phishing and online fraud with our advanced security scanner.",
    url: "/",
    siteName: "Scam Protector",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: new URL(
          "/api/og?title=Detect Online Scams Instantly&description=Free tool to check if a website is safe or malicious&type=default",
          process.env.NEXT_PUBLIC_BASE_URL || "https://scam-protector.com"
        ).toString(),
        width: 1200,
        height: 630,
        alt: "Scam Protector homepage screenshot",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Scam Detection Tool",
    description:
      "Check any website for scams, phishing, and security issues. Stay safe online with Scam Protector.",
    images: [
      new URL(
        "/api/og?title=Detect Online Scams Instantly&description=Free tool to check if a website is safe or malicious&type=default",
        process.env.NEXT_PUBLIC_BASE_URL || "https://scam-protector.com"
      ).toString(),
    ],
  },
};
