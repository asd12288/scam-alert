"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Download,
  Shield,
  AlertTriangle,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Clock,
  Bell,
  Eye,
  Globe,
  Zap,
  Monitor,
  ArrowRight,
  Users,
  Star,
  Youtube,
  Chrome,
  FileText,
} from "lucide-react";

// FAQ item component
const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex w-full justify-between items-center text-left font-medium text-gray-800 hover:text-blue-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-blue-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isOpen && <div className="mt-2 text-gray-600 text-base">{answer}</div>}
    </div>
  );
};

// Feature card component
const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
    <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4 text-blue-600">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 flex-grow">{description}</p>
  </div>
);

// Testimonial component
const Testimonial = ({
  name,
  role,
  content,
}: {
  name: string;
  role: string;
  content: string;
}) => (
  <div className="bg-white p-6 rounded-lg shadow border border-gray-100 h-full">
    <div className="flex items-center mb-4">
      <div className="ml-2">
        <div className="flex mb-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          ))}
        </div>
      </div>
    </div>
    <p className="text-gray-600 italic mb-4">"{content}"</p>
    <div className="font-medium text-gray-900">{name}</div>
    <div className="text-gray-500 text-sm">{role}</div>
  </div>
);

const ExtensionPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Scam-Protector Browser Extension
              </h1>
              <p className="text-xl mb-6 text-blue-100">
                Browse safely with real-time protection against scams and
                malicious websites.
              </p>
              <div className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium flex items-center gap-2 max-w-xs justify-center text-lg shadow-md relative">
                <Download className="w-5 h-5" />
                <span>Coming Soon</span>
                <span className="absolute -top-3 -right-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full shadow-md">Soon!</span>
              </div>
              <div className="mt-4 flex items-center text-blue-100">
                <Check className="w-5 h-5 mr-2" />
                <span>100% free and privacy-focused</span>
              </div>
            </div>
            <div className="md:w-1/2 relative h-72 md:h-96">
              {/* Replace with actual extension screenshot */}
              <div className="bg-white p-4 rounded-lg shadow-lg transform rotate-3 absolute right-4 top-4 border-4 border-white">
                <div className="bg-red-100 p-3 rounded-md border border-red-200 mb-3">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                    <span className="font-medium text-red-600">
                      Warning: Low Trust Score
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                    <div className="bg-red-600 h-2 rounded-full w-2/5"></div>
                  </div>
                </div>
                <div className="bg-gray-100 h-40 rounded-md flex items-center justify-center">
                  <span className="text-gray-500 text-sm">
                    Extension Preview
                  </span>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-lg absolute left-4 bottom-4 transform -rotate-2 border-4 border-white">
                <div className="flex items-center mb-2">
                  <Shield className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-medium">Site Verified: Trusted</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="bg-green-600 h-2 rounded-full w-4/5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Real-time Protection"
              description="Automatically scans every website you visit and warns you about potentially dangerous ones before you interact with them."
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Visual Risk Meter"
              description="See at a glance how risky a website is with our intuitive risk meter that visualizes the trust score on highlighted links."
            />
            <FeatureCard
              icon={<Bell className="w-6 h-6" />}
              title="Safety Banner Alerts"
              description="Get clear warnings with custom banners when you're on a potentially harmful website, helping you make safer browsing decisions."
            />
            <FeatureCard
              icon={<Eye className="w-6 h-6" />}
              title="Link Highlighting"
              description="Potentially dangerous links are outlined with warning indicators so you can spot them before clicking."
            />
            <FeatureCard
              icon={<Clock className="w-6 h-6" />}
              title="Instant Analysis"
              description="Our extension works lightning-fast to check websites against our secure database without slowing down your browsing."
            />
            <FeatureCard
              icon={<Globe className="w-6 h-6" />}
              title="Wide Coverage"
              description="Protects against phishing sites, fake shops, malware distributors, and other online scams across the web."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Websites</h3>
              <p className="text-gray-600">
                As you browse the web, our extension works silently in the
                background to protect you.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Analysis</h3>
              <p className="text-gray-600">
                Each website is instantly checked against our database of known
                scams and analyzed for risk factors.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Protected</h3>
              <p className="text-gray-600">
                If a risk is detected, you'll receive an immediate alert with
                detailed safety information before any harm is done.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Guide */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Coming Soon to Your Browser
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            We're putting the finishing touches on our browser extension. Sign up below to be notified when it launches!
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <span className="font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Add to Browser</h3>
              <p className="text-gray-600 mb-4">
                Once available, you'll be able to add our extension with just one click from the Chrome Web Store.
              </p>
              <Chrome className="w-8 h-8 text-gray-700" />
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <span className="font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Confirm Installation
              </h3>
              <p className="text-gray-600 mb-4">
                Click "Add Extension" when prompted by your browser to complete
                installation.
              </p>
              <Download className="w-8 h-8 text-gray-700" />
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <span className="font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Start Browsing Safely
              </h3>
              <p className="text-gray-600 mb-4">
                That's it! You'll be protected as you browse the web. Look for
                our icon in your browser bar.
              </p>
              <Shield className="w-8 h-8 text-gray-700" />
            </div>
          </div>
        </div>
      </section>

      {/* Browser Support */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
            Coming Soon To These Browsers
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Scam-Protector will be available for all major browsers, ensuring you're
            protected no matter how you browse.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <Chrome className="w-12 h-12 text-blue-600 mb-3" />
              <h3 className="font-medium mb-2">Chrome</h3>
              <span className="text-blue-600 flex items-center text-sm">
                <Clock className="w-4 h-4 mr-1" /> Coming Soon
              </span>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <svg
                className="w-12 h-12 text-blue-700 mb-3"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12.8 6.8c.1-.2.1-.5-.1-.7s-.4-.3-.7-.2L2.5 9.3c-.2.1-.3.3-.3.5s.1.4.3.5l9.5 3.4c.1 0 .1.1.2.1.2 0 .4-.1.5-.3.1-.2.1-.5-.1-.7L5.5 10l7.3-3.2z" />
              </svg>
              <h3 className="font-medium mb-2">Edge</h3>
              <span className="text-blue-600 flex items-center text-sm">
                <Clock className="w-4 h-4 mr-1" /> Coming Soon
              </span>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow opacity-70">
              <svg
                className="w-12 h-12 text-orange-600 mb-3"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                <circle cx="12" cy="12" r="5" />
              </svg>
              <h3 className="font-medium mb-2">Firefox</h3>
              <span className="text-blue-600 flex items-center text-sm">
                <Clock className="w-4 h-4 mr-1" /> Coming Soon
              </span>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow opacity-70">
              <svg
                className="w-12 h-12 text-blue-500 mb-3"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
              <h3 className="font-medium mb-2">Safari</h3>
              <span className="text-blue-600 flex items-center text-sm">
                <Clock className="w-4 h-4 mr-1" /> Coming Soon
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
            What Our Users Say
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Join thousands of users who trust Scam-Protector to keep them safe
            online.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <Testimonial
              name="Sarah Johnson"
              role="Online Shopper"
              content="This extension saved me from entering my credit card details on a fake shopping site. The warning popped up just in time!"
            />
            <Testimonial
              name="Michael Chen"
              role="Tech Enthusiast"
              content="I've tried several security extensions, but this one has the best balance of protection without slowing down my browsing experience."
            />
            <Testimonial
              name="Emma Rodriguez"
              role="Small Business Owner"
              content="As someone who handles sensitive client information daily, this extension gives me peace of mind when browsing new websites."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-blue-100">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1.2M+</div>
              <div className="text-blue-100">Websites Analyzed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">45K+</div>
              <div className="text-blue-100">Threats Detected</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.8/5</div>
              <div className="text-blue-100">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto">
            <FAQItem
              question="How does Scam-Protector detect scams?"
              answer={
                <>
                  <p>
                    Scam-Protector uses a combination of techniques to detect
                    potential scams:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>
                      Checking against our constantly updated database of known
                      scam websites
                    </li>
                    <li>Analyzing website content for suspicious patterns</li>
                    <li>Evaluating domain age and reputation</li>
                    <li>Detecting suspicious URL structures and redirects</li>
                    <li>Monitoring for phishing attempts</li>
                  </ul>
                </>
              }
            />
            <FAQItem
              question="Does this extension slow down my browsing?"
              answer="No, Scam-Protector is designed to work efficiently in the background. Our lightweight approach ensures minimal impact on your browsing speed while still providing robust protection."
            />
            <FAQItem
              question="Is Scam-Protector free to use?"
              answer="Yes, Scam-Protector is completely free! We believe online safety should be accessible to everyone, so we offer our core protection features at no cost."
            />
            <FAQItem
              question="Does Scam-Protector collect my browsing data?"
              answer="No, we respect your privacy. Scam-Protector does not track your browsing history or collect personal data. The extension only checks websites against our security database without storing your activity."
            />
            <FAQItem
              question="How do I report a suspicious website?"
              answer={
                <>
                  <p>
                    If you encounter a suspicious website:
                  </p>
                  <ol className="list-decimal pl-5 mt-2 space-y-1">
                    <li>
                      Use our website's reporting form
                    </li>
                    <li>Fill in the quick form with details about the suspicious site</li>
                    <li>Click "Submit Report"</li>
                  </ol>
                  <p className="mt-2">
                    Our team will review your report promptly and update our
                    database if the site is confirmed to be malicious.
                  </p>
                </>
              }
            />
            <FAQItem
              question="When will the Scam-Protector extension be available?"
              answer="We're currently putting the final touches on our browser extension. We expect to launch on Chrome and Edge first in the coming weeks, with Firefox and Safari versions following shortly after. Sign up for our newsletter to be notified as soon as it's ready!"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Be the First to Get Protected
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-blue-100">
            Sign up now to be notified when our browser extension launches. Don't wait until after you've been scammed!
          </p>
          <div className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-medium inline-flex items-center gap-2 text-lg shadow-md cursor-pointer">
            <Bell className="w-5 h-5" />
            Get Notified When We Launch
          </div>
          <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4 text-sm">
            <Link href="/guide" className="flex items-center hover:underline">
              <FileText className="w-4 h-4 mr-1" />
              Usage Guide
            </Link>
            <span className="hidden md:inline">•</span>
            <Link href="/privacy" className="flex items-center hover:underline">
              <Shield className="w-4 h-4 mr-1" />
              Privacy Policy
            </Link>
            <span className="hidden md:inline">•</span>
            <Link href="/report" className="flex items-center hover:underline">
              <AlertTriangle className="w-4 h-4 mr-1" />
              Report a Scam
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExtensionPage;
