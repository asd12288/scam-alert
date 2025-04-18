import type { Metadata } from "next";

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
