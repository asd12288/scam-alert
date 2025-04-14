import React from "react";
import Link from "next/link";
import { Shield, ChevronRight, File, ExternalLink } from "lucide-react";

export const metadata = {
  title: "AI Scam Prevention Guide | AI Scam Alert",
  description:
    "Comprehensive guide powered by AI to protect yourself from online scams",
};

export default function GuidePage() {
  return (
    <div className="py-8 max-w-4xl mx-auto px-4">
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

        {/* Table of Contents */}
        <div className="bg-blue-50 p-6 rounded-lg mb-8 border border-blue-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Quick Navigation
          </h2>
          <ul className="grid gap-3 md:grid-cols-2">
            <li>
              <a
                href="#common-scams"
                className="text-gray-800 hover:text-blue-700 hover:underline flex items-center"
              >
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-center mr-2">
                  1
                </span>
                Recognizing Common Scams
              </a>
            </li>
            <li>
              <a
                href="#protection"
                className="text-gray-800 hover:text-blue-700 hover:underline flex items-center"
              >
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-center mr-2">
                  2
                </span>
                Protecting Your Information
              </a>
            </li>
            <li>
              <a
                href="#verification"
                className="text-gray-800 hover:text-blue-700 hover:underline flex items-center"
              >
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-center mr-2">
                  3
                </span>
                Website Verification Tools
              </a>
            </li>
            <li>
              <a
                href="#reporting"
                className="text-gray-800 hover:text-blue-700 hover:underline flex items-center"
              >
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-center mr-2">
                  4
                </span>
                Reporting Scams
              </a>
            </li>
          </ul>
        </div>

        {/* Section 1: Common Scams */}
        <section id="common-scams" className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center text-gray-900">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3 flex-shrink-0">
              1
            </span>
            Recognizing Common Scams
          </h2>

          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <div className="border rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-xl mb-3 text-gray-900">
                Phishing Attempts
              </h3>
              <p className="mb-3">
                Be wary of emails or messages that create a sense of urgency,
                contain suspicious links, or ask for personal information.
              </p>
              <div className="bg-blue-50 p-4 rounded">
                <p className="font-medium mb-2">Warning Signs:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Unusual sender email addresses</li>
                  <li>Spelling and grammar errors</li>
                  <li>Requests for sensitive information</li>
                  <li>Generic greetings (e.g., "Dear Customer")</li>
                </ul>
              </div>
              <Link
                href="/blogs/common-phishing-techniques"
                className="text-blue-600 hover:underline font-medium mt-3 inline-flex items-center"
              >
                Learn more about phishing <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="border rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-xl mb-3 text-gray-900">
                Fake Websites
              </h3>
              <p className="mb-3">
                Check for secure connections (https), verify domain names, and
                look for poor design or grammar errors.
              </p>
              <div className="bg-blue-50 p-4 rounded">
                <p className="font-medium mb-2">How to Verify:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Look for the padlock icon in your browser</li>
                  <li>Use our domain verification tool</li>
                  <li>Check business registration details</li>
                  <li>Search for reviews from other customers</li>
                </ul>
              </div>
              <Link
                href="/blogs/spot-fake-online-stores"
                className="text-blue-600 hover:underline font-medium mt-3 inline-flex items-center"
              >
                Learn to spot fake stores <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="border rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-xl mb-3 text-gray-900">
                Too-Good-To-Be-True Offers
              </h3>
              <p className="mb-3">
                If a deal seems unusually generous or implausible, it probably
                is. Research thoroughly before proceeding.
              </p>
              <div className="bg-blue-50 p-4 rounded">
                <p className="font-medium mb-2">Red Flags:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Extreme discounts with no clear reason</li>
                  <li>Limited time pressure tactics</li>
                  <li>Requests for unusual payment methods</li>
                  <li>Vague company information</li>
                </ul>
              </div>
            </div>

            <div className="border rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-xl mb-3 text-gray-900">
                Social Media Scams
              </h3>
              <p className="mb-3">
                From romance scams to fake giveaways, social media platforms
                have become hunting grounds for scammers.
              </p>
              <div className="bg-blue-50 p-4 rounded">
                <p className="font-medium mb-2">Common Tactics:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Fake profiles impersonating others</li>
                  <li>Investment and cryptocurrency schemes</li>
                  <li>Counterfeit product listings</li>
                  <li>Fraudulent job opportunities</li>
                </ul>
              </div>
              <Link
                href="/blogs/social-media-scams"
                className="text-blue-600 hover:underline font-medium mt-3 inline-flex items-center"
              >
                Explore social media scams <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Section 2: Protection */}
        <section id="protection" className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center text-gray-900">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3 flex-shrink-0">
              2
            </span>
            Protecting Your Information
          </h2>

          <p className="mb-6">
            Taking proactive steps to secure your personal information is
            essential in preventing scams.
          </p>

          <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm">
            <div className="grid gap-6 md:grid-cols-2">
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
                <div className="bg-red-50 p-4 rounded border border-red-100">
                  <p className="font-medium text-red-700 mb-2">
                    ❌ Poor Password Practices
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-red-800">
                    <li>Using the same password for multiple accounts</li>
                    <li>Simple, easy-to-guess passwords (123456, password)</li>
                    <li>Including personal information (birthdate, name)</li>
                    <li>Writing passwords down in unsecured locations</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded border border-green-100">
                  <p className="font-medium text-green-700 mb-2">
                    ✓ Recommended Practices
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-green-800">
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
          <h2 className="text-2xl font-semibold mb-6 flex items-center text-gray-900">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3 flex-shrink-0">
              3
            </span>
            Website Verification Tools
          </h2>

          <p className="mb-6">
            Use our domain checker tool to verify websites before sharing any
            information.
          </p>

          <div className="bg-blue-50 p-6 rounded-lg mb-6 border border-blue-100">
            <h3 className="font-semibold mb-4 text-gray-900">
              Our Scam Checker Tool
            </h3>
            <p className="mb-4">
              Our website provides a free tool to check if a domain is
              potentially dangerous:
            </p>
            <Link
              href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg inline-block hover:bg-blue-700 transition-colors font-medium"
            >
              Try Our Domain Checker
            </Link>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-4 text-gray-900">
              Other Verification Resources
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 mr-3 flex-shrink-0 text-sm">
                  •
                </span>
                <div>
                  <p className="font-medium text-gray-900">WHOIS Lookup</p>
                  <p className="text-gray-600 mb-1">
                    Check how long a domain has been registered. Newly created
                    domains can be suspicious.
                  </p>
                  <a
                    href="https://whois.domaintools.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline inline-flex items-center"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" /> Visit WHOIS lookup
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 mr-3 flex-shrink-0 text-sm">
                  •
                </span>
                <div>
                  <p className="font-medium text-gray-900">
                    Google Safe Browsing
                  </p>
                  <p className="text-gray-600 mb-1">
                    Google's tool to check if a website is known for phishing or
                    malware.
                  </p>
                  <a
                    href="https://transparencyreport.google.com/safe-browsing/search"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline inline-flex items-center"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" /> Check with Google
                    Safe Browsing
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 mr-3 flex-shrink-0 text-sm">
                  •
                </span>
                <div>
                  <p className="font-medium text-gray-900">VirusTotal</p>
                  <p className="text-gray-600 mb-1">
                    Analyzes suspicious URLs and files for malicious content.
                  </p>
                  <a
                    href="https://www.virustotal.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline inline-flex items-center"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" /> Visit VirusTotal
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 4: Reporting Scams */}
        <section id="reporting" className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center text-gray-900">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3 flex-shrink-0">
              4
            </span>
            Reporting Scams
          </h2>

          <p className="mb-6">
            If you encounter a scam, reporting it helps protect others and may
            help you recover losses.
          </p>

          <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
            <div className="grid md:grid-cols-2">
              <div className="p-6">
                <h3 className="font-semibold mb-4 text-gray-900">
                  Where to Report Scams
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 mr-3 flex-shrink-0">
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
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 mr-3 flex-shrink-0">
                      2
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">
                        Federal Trade Commission (FTC)
                      </p>
                      <p className="text-gray-600 mb-1">
                        Report scams to the FTC at ReportFraud.ftc.gov.
                      </p>
                      <a
                        href="https://reportfraud.ftc.gov/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline inline-flex items-center"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" /> Report to FTC
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 mr-3 flex-shrink-0">
                      3
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">
                        FBI Internet Crime Complaint Center (IC3)
                      </p>
                      <p className="text-gray-600 mb-1">
                        Report internet crimes at IC3.gov.
                      </p>
                      <a
                        href="https://www.ic3.gov/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline inline-flex items-center"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" /> Report to IC3
                      </a>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 p-6 border-l border-blue-100">
                <h3 className="font-semibold mb-4 text-gray-900">
                  What Information to Include
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Date and time of the incident</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Description of the scam</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>
                      Website URLs, email addresses, or phone numbers used
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Screenshots or copies of communications</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>How much money was lost (if applicable)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Method of payment used</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>Any actions you've already taken</span>
                  </li>
                </ul>

                <div className="mt-6 pt-6 border-t border-blue-200">
                  <div className="flex items-start">
                    <File className="w-5 h-5 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">
                        Download our reporting checklist
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        A printable guide with all the information you should
                        collect before reporting a scam
                      </p>
                      <button className="mt-2 px-3 py-1.5 bg-white border border-blue-200 rounded text-blue-600 text-sm hover:bg-blue-50 transition-colors">
                        Download PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <div className="bg-blue-50 p-8 rounded-lg text-center border border-blue-100">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Stay Informed with Our Blog
          </h2>
          <p className="mb-6">
            Our blog regularly covers the latest scam techniques and prevention
            strategies.
          </p>
          <Link
            href="/blogs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg inline-block hover:bg-blue-700 transition-colors font-medium"
          >
            Read Our Latest Articles
          </Link>
        </div>
      </div>
    </div>
  );
}
