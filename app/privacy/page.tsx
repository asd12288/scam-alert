import React from "react";

export const metadata = {
  title: "Privacy Policy | AI Scam Alert",
  description:
    "Privacy Policy for AI Scam Alert's online scam detection service",
};

const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-lg mb-4">Last updated: April 15, 2025</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p>
            AI Scam Alert ("we," "our," or "us") respects your privacy and is
            committed to protecting your personal information. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your
            information when you use our website and services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Information We Collect
          </h2>
          <p className="mb-4">We collect the following types of information:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Domain Names</strong>: We collect the domain names that
              you submit for security analysis.
            </li>
            <li>
              <strong>User Account Information</strong>: If you create an
              account, we collect your email address and password (stored
              securely).
            </li>
            <li>
              <strong>Usage Data</strong>: We collect information about how you
              interact with our service, including your search history and usage
              patterns.
            </li>
            <li>
              <strong>Device Information</strong>: We automatically collect
              certain information about your device, including IP address,
              browser type, and operating system.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            How We Use Your Information
          </h2>
          <p className="mb-4">We use the information we collect to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide and improve our scam detection services</li>
            <li>
              Analyze domain security patterns to enhance our detection
              algorithms
            </li>
            <li>Personalize your experience and show you relevant content</li>
            <li>Communicate with you about our services</li>
            <li>Ensure the security and integrity of our platform</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Data Sharing and Disclosure
          </h2>
          <p className="mb-4">We may share your information with:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Service Providers</strong>: Third-party vendors who help
              us provide our services
            </li>
            <li>
              <strong>Legal Requirements</strong>: When required by law or to
              protect our rights
            </li>
            <li>
              <strong>Business Transfers</strong>: In connection with a merger,
              acquisition, or sale of assets
            </li>
          </ul>
          <p>We do not sell your personal information to third parties.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to
            protect your personal information. However, no method of
            transmission over the Internet or electronic storage is 100% secure,
            so we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
          <p className="mb-4">
            Depending on your location, you may have the right to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to our processing of your data</li>
            <li>Request restriction of processing</li>
            <li>Request data portability</li>
          </ul>
          <p>
            To exercise these rights, please contact us at
            privacy@aiscamalert.com.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Changes to This Policy
          </h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the "Last updated" date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p>
            If you have questions or concerns about this Privacy Policy, please
            contact us at privacy@aiscamalert.com.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
