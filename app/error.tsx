"use client";

import { useEffect } from "react";
import { Shield } from "lucide-react";
import Link from "next/link";
import { JsonLd } from "react-schemaorg";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <>
      {/* Structured data for the error page */}
      <JsonLd<any>
        item={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Error Page - Scam Protector",
          description:
            "Something went wrong while using Scam Protector. Please try again or return to the homepage.",
        }}
      />

      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-8">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h1>
          <p className="text-gray-600 mb-6">
            We're sorry, but there was an error with your request. Please try
            again.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try again
            </button>
            <Link
              href="/"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Return to home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
