import React from "react";
import Link from "next/link";

export const metadata = {
  title: "AI Scam Prevention Guide | AI Scam Alert",
  description:
    "Comprehensive guide powered by AI to protect yourself from online scams",
};

export default function GuidePage() {
  return (
    <div className="py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">
        AI-Powered Guide to Avoiding Online Scams
      </h1>

      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl text-gray-600 mb-6">
          This AI-enhanced comprehensive guide will help you recognize, avoid,
          and report online scams to stay safe in the digital world. Our AI
          technology identifies emerging threats faster than traditional
          methods.
        </p>

        {/* Table of Contents */}
        <div className="bg-[#fff8f8] p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Quick Navigation
          </h2>
          <ul className="grid gap-2 md:grid-cols-2">
            <li>
              <a
                href="#common-scams"
                className="text-gray-800 hover:text-[rgb(255,77,79)] hover:underline flex items-center"
              >
                <span className="inline-block w-6 h-6 rounded-full bg-[rgba(255,77,79,0.1)] text-[rgb(255,77,79)] text-center mr-2">
                  1
                </span>
                Recognizing Common Scams
              </a>
            </li>
            <li>
              <a
                href="#protection"
                className="text-gray-800 hover:text-[rgb(255,77,79)] hover:underline flex items-center"
              >
                <span className="inline-block w-6 h-6 rounded-full bg-[rgba(255,77,79,0.1)] text-[rgb(255,77,79)] text-center mr-2">
                  2
                </span>
                Protecting Your Information
              </a>
            </li>
            <li>
              <a
                href="#verification"
                className="text-gray-800 hover:text-[rgb(255,77,79)] hover:underline flex items-center"
              >
                <span className="inline-block w-6 h-6 rounded-full bg-[rgba(255,77,79,0.1)] text-[rgb(255,77,79)] text-center mr-2">
                  3
                </span>
                Website Verification Tools
              </a>
            </li>
            <li>
              <a
                href="#reporting"
                className="text-gray-800 hover:text-[rgb(255,77,79)] hover:underline flex items-center"
              >
                <span className="inline-block w-6 h-6 rounded-full bg-[rgba(255,77,79,0.1)] text-[rgb(255,77,79)] text-center mr-2">
                  4
                </span>
                Reporting Scams
              </a>
            </li>
          </ul>
        </div>

        {/* Section 1: Common Scams */}
        <section id="common-scams" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-900">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[rgba(255,77,79,0.1)] text-[rgb(255,77,79)] mr-3 flex-shrink-0">
              1
            </span>
            Recognizing Common Scams
          </h2>

          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <div className="border rounded-lg p-5 bg-white">
              <h3 className="font-semibold text-xl mb-3 text-gray-900">
                Phishing Attempts
              </h3>
              <p className="mb-3">
                Be wary of emails or messages that create a sense of urgency,
                contain suspicious links, or ask for personal information.
              </p>
              <div className="bg-[#fff8f8] p-3 rounded">
                <p className="font-medium">Warning Signs:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Unusual sender email addresses</li>
                  <li>Spelling and grammar errors</li>
                  <li>Requests for sensitive information</li>
                  <li>Generic greetings (e.g., "Dear Customer")</li>
                </ul>
              </div>
              <Link
                href="/blogs/common-phishing-techniques"
                className="text-[rgb(255,77,79)] hover:underline font-medium mt-3 inline-block"
              >
                Learn more about phishing →
              </Link>
            </div>

            <div className="border rounded-lg p-5 bg-white">
              <h3 className="font-semibold text-xl mb-3 text-gray-900">
                Fake Websites
              </h3>
              <p className="mb-3">
                Check for secure connections (https), verify domain names, and
                look for poor design or grammar errors.
              </p>
              <div className="bg-[#fff8f8] p-3 rounded">
                <p className="font-medium">How to Verify:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Look for the padlock icon in your browser</li>
                  <li>Use our domain verification tool</li>
                  <li>Check business registration details</li>
                  <li>Search for reviews from other customers</li>
                </ul>
              </div>
              <Link
                href="/blogs/spot-fake-online-stores"
                className="text-[rgb(255,77,79)] hover:underline font-medium mt-3 inline-block"
              >
                Learn to spot fake stores →
              </Link>
            </div>

            <div className="border rounded-lg p-5 bg-white">
              <h3 className="font-semibold text-xl mb-3 text-gray-900">
                Too-Good-To-Be-True Offers
              </h3>
              <p className="mb-3">
                If a deal seems unusually generous or implausible, it probably
                is. Research thoroughly before proceeding.
              </p>
              <div className="bg-[#fff8f8] p-3 rounded">
                <p className="font-medium">Red Flags:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Extreme discounts with no clear reason</li>
                  <li>Limited time pressure tactics</li>
                  <li>Requests for unusual payment methods</li>
                  <li>Vague company information</li>
                </ul>
              </div>
            </div>

            <div className="border rounded-lg p-5 bg-white">
              <h3 className="font-semibold text-xl mb-3 text-gray-900">
                Social Media Scams
              </h3>
              <p className="mb-3">
                From romance scams to fake giveaways, social media platforms
                have become hunting grounds for scammers.
              </p>
              <div className="bg-[#fff8f8] p-3 rounded">
                <p className="font-medium">Common Tactics:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Fake profiles impersonating others</li>
                  <li>Investment and cryptocurrency schemes</li>
                  <li>Counterfeit product listings</li>
                  <li>Fraudulent job opportunities</li>
                </ul>
              </div>
              <Link
                href="/blogs/social-media-scams"
                className="text-[rgb(255,77,79)] hover:underline font-medium mt-3 inline-block"
              >
                Explore social media scams →
              </Link>
            </div>
          </div>
        </section>

        {/* Section 2: Protection */}
        <section id="protection" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-900">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[rgba(255,77,79,0.1)] text-[rgb(255,77,79)] mr-3 flex-shrink-0">
              2
            </span>
            Protecting Your Information
          </h2>

          <p className="mb-6">
            Taking proactive steps to secure your personal information is
            essential in preventing scams.
          </p>

          <div className="bg-white border rounded-lg p-6 mb-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-medium text-lg mb-3 text-gray-900">
                  Account Security
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Use strong, unique passwords for different accounts</li>
                  <li>Enable two-factor authentication whenever possible</li>
                  <li>Regularly update your devices and applications</li>
                  <li>Be cautious with the information you share online</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-lg mb-3 text-gray-900">
                  Safe Browsing Habits
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Verify website security before making purchases</li>
                  <li>Don't click on suspicious links in emails or messages</li>
                  <li>
                    Use credit cards instead of debit cards for online shopping
                  </li>
                  <li>
                    Monitor your accounts regularly for suspicious activity
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium text-lg mb-3 text-gray-900">
                Password Best Practices
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-[#fff8f8] p-4 rounded">
                  <p className="font-medium text-[rgb(255,77,79)] mb-2">
                    ❌ Poor Password Practices
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Using the same password for multiple accounts</li>
                    <li>Simple, easy-to-guess passwords (123456, password)</li>
                    <li>Including personal information (birthdate, name)</li>
                    <li>Writing passwords down in unsecured locations</li>
                  </ul>
                </div>

                <div className="bg-[#f0fff0] p-4 rounded">
                  <p className="font-medium text-[rgb(82,196,26)] mb-2">
                    ✓ Recommended Practices
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      Using a password manager to generate and store passwords
                    </li>
                    <li>Creating long passphrases (12+ characters)</li>
                    <li>Including a mix of letters, numbers, and symbols</li>
                    <li>Changing passwords periodically</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Website Verification */}
        <section id="verification" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-900">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[rgba(255,77,79,0.1)] text-[rgb(255,77,79)] mr-3 flex-shrink-0">
              3
            </span>
            Website Verification Tools
          </h2>

          <p className="mb-6">
            Use our domain checker tool to verify websites before sharing any
            information.
          </p>

          <div className="bg-[#fff8f8] p-6 rounded-lg mb-6">
            <h3 className="font-semibold mb-4 text-gray-900">
              Our Scam Checker Tool
            </h3>
            <p className="mb-4">
              Our website provides a free tool to check if a domain is
              potentially dangerous:
            </p>
            <Link
              href="/"
              className="bg-[rgb(255,77,79)] text-white px-6 py-3 rounded-lg inline-block hover:bg-[rgb(255,30,30)] transition-colors"
            >
              Try Our Domain Checker →
            </Link>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h3 className="font-semibold mb-4 text-gray-900">
              Other Verification Resources
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[rgba(255,77,79,0.1)] text-[rgb(255,77,79)] mr-3 flex-shrink-0 text-sm">
                  •
                </span>
                <div>
                  <p className="font-medium text-gray-900">WHOIS Lookup</p>
                  <p className="text-gray-600">
                    Check how long a domain has been registered. Newly created
                    domains can be suspicious.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[rgba(255,77,79,0.1)] text-[rgb(255,77,79)] mr-3 flex-shrink-0 text-sm">
                  •
                </span>
                <div>
                  <p className="font-medium text-gray-900">
                    Google Safe Browsing
                  </p>
                  <p className="text-gray-600">
                    Google's tool to check if a website is known for phishing or
                    malware.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[rgba(255,77,79,0.1)] text-[rgb(255,77,79)] mr-3 flex-shrink-0 text-sm">
                  •
                </span>
                <div>
                  <p className="font-medium text-gray-900">VirusTotal</p>
                  <p className="text-gray-600">
                    Analyzes suspicious URLs and files for malicious content.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 4: Reporting Scams */}
        <section id="reporting" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-900">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[rgba(255,77,79,0.1)] text-[rgb(255,77,79)] mr-3 flex-shrink-0">
              4
            </span>
            Reporting Scams
          </h2>

          <p className="mb-6">
            If you encounter a scam, reporting it helps protect others and may
            help you recover losses.
          </p>

          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-6">
                <h3 className="font-semibold mb-4 text-gray-900">
                  Where to Report Scams
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="inline-block w-6 h-6 rounded-full bg-[rgba(255,77,79,0.1)] text-[rgb(255,77,79)] text-center mr-2 flex-shrink-0">
                      1
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">
                        Your Local Law Enforcement
                      </p>
                      <p className="text-gray-600">
                        File a police report, especially if you've lost money.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-6 h-6 rounded-full bg-[rgba(255,77,79,0.1)] text-[rgb(255,77,79)] text-center mr-2 flex-shrink-0">
                      2
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">
                        Federal Trade Commission (FTC)
                      </p>
                      <p className="text-gray-600">
                        Report scams to the FTC at ReportFraud.ftc.gov.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-6 h-6 rounded-full bg-[rgba(255,77,79,0.1)] text-[rgb(255,77,79)] text-center mr-2 flex-shrink-0">
                      3
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">
                        FBI Internet Crime Complaint Center (IC3)
                      </p>
                      <p className="text-gray-600">
                        Report internet crimes at IC3.gov.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-6 h-6 rounded-full bg-[rgba(255,77,79,0.1)] text-[rgb(255,77,79)] text-center mr-2 flex-shrink-0">
                      4
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">
                        Financial Institutions
                      </p>
                      <p className="text-gray-600">
                        Contact your bank or credit card company immediately.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-[#fff8f8] p-6">
                <h3 className="font-semibold mb-4 text-gray-900">
                  What Information to Include
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Date and time of the incident</li>
                  <li>Description of the scam</li>
                  <li>Website URLs, email addresses, or phone numbers used</li>
                  <li>Screenshots or copies of communications</li>
                  <li>How much money was lost (if applicable)</li>
                  <li>Method of payment used</li>
                  <li>Any actions you've already taken</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <div className="bg-[#fff8f8] p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Stay Informed with Our Blog
          </h2>
          <p className="mb-6">
            Our blog regularly covers the latest scam techniques and prevention
            strategies.
          </p>
          <Link
            href="/blogs"
            className="bg-[rgb(255,77,79)] text-white px-6 py-3 rounded-lg inline-block hover:bg-[rgb(255,30,30)] transition-colors"
          >
            Read Our Latest Articles
          </Link>
        </div>
      </div>
    </div>
  );
}
