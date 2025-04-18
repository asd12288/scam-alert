import React from "react";
import Link from "next/link";
import { Shield, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Scam Prevention Guide | Scam Protector",
  description:
    "Comprehensive guide to protect yourself from online scams",
};

export default function GuidePage() {
  return (
    <div className="py-12 max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">
        AI-Powered Guide to Avoiding Online Scams
      </h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 mb-8">
          This AI-enhanced comprehensive guide will help you recognize, avoid,
          and report online scams to stay safe in the digital world. Our AI
          technology identifies emerging threats faster than traditional
          methods.
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
            back soon for detailed information on common scam types, prevention
            strategies, and reporting procedures.
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
                Tools and techniques to verify website legitimacy before sharing
                personal information.
              </p>
            </div>

            <div className="border rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-xl mb-3 text-gray-900">
                Reporting Scams
              </h3>
              <p className="text-gray-600">
                How to properly report scams to authorities and what information
                to include.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
