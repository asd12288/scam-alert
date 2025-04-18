import React from "react";
import { Shield, Search } from "lucide-react";
import Link from "next/link";
import { JsonLd } from "react-schemaorg";

export const metadata = {
  title: "Page Not Found | Scam Protector",
  description:
    "Sorry, we couldn't find the page you were looking for. Check out our other resources on scam protection.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <>
      {/* Structured data for the 404 page */}
      <JsonLd<any>
        item={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Page Not Found - Scam Protector",
          description:
            "Sorry, we couldn't find the page you were looking for. Check out our other resources on scam protection.",
          mainContentOfPage: {
            "@type": "WebPageElement",
            cssSelector: ".not-found-content",
          },
        }}
      />

      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-md w-full text-center not-found-content">
          <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Shield className="h-10 w-10 text-blue-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Page Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you were looking for. The link
            might be broken, or the page may have been moved or removed.
          </p>

          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              <Search className="w-4 h-4 mr-2" />
              Try our scam scanner
            </Link>

            <div className="pt-8 border-t border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-3">
                Helpful resources
              </h2>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/guide"
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Guide to avoiding online scams
                  </Link>
                </li>
                <li>
                  <Link
                    href="/report"
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Report a suspicious website
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blogs"
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Read our security blog
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
