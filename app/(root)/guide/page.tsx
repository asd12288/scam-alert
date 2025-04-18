import React from "react";
import Link from "next/link";
import { Shield, ChevronRight } from "lucide-react";
import { JsonLd } from "react-schemaorg";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comprehensive Scam Prevention Guide | Scam Protector",
  description:
    "Learn how to identify, avoid, and report online scams with our comprehensive guide to protect yourself in the digital world.",
  keywords: [
    "scam prevention",
    "online fraud guide",
    "internet safety",
    "phishing protection",
    "identify scams",
    "report fraud",
    "online security",
  ],
  alternates: {
    canonical: "/guide",
  },
  openGraph: {
    title: "Comprehensive Guide to Avoiding Online Scams",
    description:
      "Learn how to identify and protect yourself from sophisticated online scams with our expert guide.",
    url: "/guide",
    type: "article",
    images: [
      {
        url: new URL(
          "/api/og?title=Scam Prevention Guide&description=Learn how to identify and avoid online scams&type=guide",
          process.env.NEXT_PUBLIC_BASE_URL || "https://scam-protector.com"
        ).toString(),
        width: 1200,
        height: 630,
        alt: "Scam Protector Guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Comprehensive Guide to Avoiding Online Scams",
    description:
      "Learn how to identify and protect yourself from sophisticated online scams with our expert guide.",
    images: [
      new URL(
        "/api/og?title=Scam Prevention Guide&description=Learn how to identify and avoid online scams&type=guide",
        process.env.NEXT_PUBLIC_BASE_URL || "https://scam-protector.com"
      ).toString(),
    ],
  },
};

export default function GuidePage() {
  return (
    <>
      {/* Structured data for Guide as FAQPage */}
      <JsonLd<any>
        item={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "How do I recognize common online scams?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Look for unexpected urgency, poor grammar, requests for personal information, too-good-to-be-true offers, and suspicious links or attachments. Always verify sender identities and double-check website URLs.",
              },
            },
            {
              "@type": "Question",
              name: "How can I protect my information online?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Use strong, unique passwords, enable two-factor authentication, keep software updated, be careful on public WiFi, and regularly monitor your accounts for suspicious activity.",
              },
            },
            {
              "@type": "Question",
              name: "Where should I report online scams?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Report scams to the FTC at ReportFraud.ftc.gov, the FBI's Internet Crime Complaint Center (IC3), your local consumer protection agency, and the affected platform or service provider.",
              },
            },
          ],
        }}
      />

      <div className="py-12 max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">
          AI-Powered Guide to Avoiding Online Scams
        </h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 mb-8">
            This comprehensive guide will help you recognize, avoid, and report
            online scams to stay safe in the digital world. Our technology
            identifies emerging threats faster than traditional methods.
          </p>

          {/* Coming Soon Content */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
            <Shield className="w-16 h-16 text-blue-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Guide Content Coming Soon
            </h2>
            <p className="text-lg text-gray-600 max-w-lg mx-auto mb-6">
              We're currently developing a comprehensive guide to help you
              identify and protect yourself from the latest online scams. Check
              back soon for detailed information on common scam types,
              prevention strategies, and reporting procedures.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Our Scam Scanner
              </Link>
              <Link
                href="/blogs"
                className="bg-white border border-blue-200 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Read Our Blog
              </Link>
            </div>
          </div>

          {/* Basic Section Preview */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">
              Guide Sections Coming Soon
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="border rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-xl mb-3 text-gray-900">
                  Recognizing Common Scams
                </h3>
                <p className="text-gray-600">
                  Learn to identify phishing attempts, fake websites,
                  too-good-to-be-true offers, and social media scams.
                </p>
              </div>

              <div className="border rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-xl mb-3 text-gray-900">
                  Protecting Your Information
                </h3>
                <p className="text-gray-600">
                  Best practices for account security, safe browsing habits, and
                  password management.
                </p>
              </div>

              <div className="border rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-xl mb-3 text-gray-900">
                  Website Verification Tools
                </h3>
                <p className="text-gray-600">
                  Tools and techniques to verify website legitimacy before
                  sharing personal information.
                </p>
              </div>

              <div className="border rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-xl mb-3 text-gray-900">
                  Reporting Scams
                </h3>
                <p className="text-gray-600">
                  How to properly report scams to authorities and what
                  information to include.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
