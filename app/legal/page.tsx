import React from "react";
import type { Metadata } from "next";
import { JsonLd } from "react-schemaorg";

export const metadata: Metadata = {
  title: "Legal Information | Scam Protector",
  description:
    "Legal information, terms of service, and disclaimers for Scam Protector's online scam detection service.",
  keywords: [
    "terms of service",
    "legal",
    "disclaimer",
    "acceptable use",
    "privacy policy",
    "security terms",
  ],
  alternates: {
    canonical: "/legal",
  },
};

const Legal = () => {
  return (
    <>
      {/* Structured data for legal page */}
      <JsonLd<any>
        item={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Legal Information",
          description:
            "Legal information, terms of service, and disclaimers for Scam Protector.",
          mainEntityOfPage: {
            "@type": "WebPageElement",
            name: "Terms of Service and Legal Information",
            description:
              "Legal terms, acceptable use policies, disclaimers, and limitations of liability for using the Scam Protector service.",
          },
          dateModified: "2025-04-15",
        }}
      />

      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Legal Information</h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg mb-4">Last updated: April 15, 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Terms of Service</h2>
            <p className="mb-4">
              By accessing or using Scam Protector, you agree to be bound by
              these Terms of Service. If you disagree with any part of the
              terms, you may not access the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Acceptable Use</h2>
            <p className="mb-4">You agree not to use this service to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Violate any laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>
                Attempt to gain unauthorized access to any portion of our
                service
              </li>
              <li>
                Interfere with or disrupt the integrity or performance of the
                service
              </li>
              <li>Upload or transmit malware or other malicious code</li>
              <li>
                Engage in automated data collection unless explicitly permitted
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
            <p className="mb-4">
              Scam Protector is provided "as is" and "as available" without any
              warranties of any kind. We do not guarantee that:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>The service will meet your specific requirements</li>
              <li>
                The service will be uninterrupted, timely, secure, or error-free
              </li>
              <li>
                The results from using the service will be accurate or reliable
              </li>
              <li>Any errors in the service will be corrected</li>
            </ul>
            <p className="mb-4">
              While we strive to provide accurate security assessments, our
              analysis should be considered as one tool among many to evaluate
              website safety. No security assessment can guarantee with absolute
              certainty that a website is safe or malicious.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Limitation of Liability
            </h2>
            <p>
              In no event shall Scam Protector, its directors, employees,
              partners, agents, suppliers, or affiliates be liable for any
              indirect, incidental, special, consequential, or punitive damages,
              including without limitation, loss of profits, data, use,
              goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                Your access to or use of or inability to access or use the
                service
              </li>
              <li>Any conduct or content of any third party on the service</li>
              <li>Any content obtained from the service</li>
              <li>
                Unauthorized access, use, or alteration of your transmissions or
                content
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the
              laws, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time.
              If a revision is material, we will provide at least 30 days'
              notice prior to any new terms taking effect. What constitutes a
              material change will be determined at our sole discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at
              legal@scam-protector.com.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default Legal;
