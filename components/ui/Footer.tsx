import React from "react";
import Link from "next/link";
import { 
  Shield, 
  FileText, 
  AlertTriangle,
  BookOpen,
  ExternalLink, 
  Twitter, 
  Facebook, 
  Instagram, 
  Download 
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8 sm:py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-600 text-white flex items-center justify-center">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <span className="font-semibold text-base sm:text-lg text-gray-800">
                Scam Protector
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              Protecting you from online scams and fraudulent websites with our advanced
              detection tools.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Twitter className="w-5 h-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Facebook className="w-5 h-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Instagram className="w-5 h-5" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-medium text-gray-800 mb-3 text-sm sm:text-base">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink href="/" label="Scan Website" />
              <FooterLink href="/guide" label="Scam Guide" />
              <FooterLink href="/blogs" label="Blog" />
              <FooterLink href="/report" label="Report Scam" />
              <FooterLink href="/extension" label="Browser Extension" />
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-medium text-gray-800 mb-3 text-sm sm:text-base">Resources</h3>
            <ul className="space-y-2">
              <FooterLink 
                href="https://chrome.google.com/webstore/detail/scam-protector/your-extension-id" 
                label="Chrome Extension" 
                external 
              />
              <FooterLink 
                href="https://microsoftedge.microsoft.com/addons/detail/scam-protector/your-extension-id" 
                label="Edge Extension" 
                external 
              />
              <FooterLink href="/guide" label="User Guide" />
              <FooterLink href="/blogs/detecting-phishing" label="Phishing Guide" />
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-medium text-gray-800 mb-3 text-sm sm:text-base">Legal</h3>
            <ul className="space-y-2">
              <FooterLink href="/legal" label="Terms of Service" />
              <FooterLink href="/privacy" label="Privacy Policy" />
              <FooterLink href="/legal#cookies" label="Cookie Policy" />
              <FooterLink href="/legal#disclaimer" label="Disclaimer" />
            </ul>
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-xs sm:text-sm">
            © {currentYear} Scam Protector. All rights reserved.
          </p>
          <div className="flex space-x-4 sm:space-x-6 mt-4 sm:mt-0">
            <Link href="/extension" className="text-xs sm:text-sm text-gray-500 hover:text-blue-600 flex items-center">
              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span>Get Extension</span>
            </Link>
            <Link href="/report" className="text-xs sm:text-sm text-gray-500 hover:text-blue-600 flex items-center">
              <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span>Report Scam</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Reusable footer link component
const FooterLink = ({ 
  href, 
  label, 
  external = false 
}: { 
  href: string;
  label: string;
  external?: boolean;
}) => {
  return (
    <li>
      <Link 
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="text-gray-500 hover:text-blue-600 text-xs sm:text-sm flex items-center"
      >
        {label}
        {external && <ExternalLink className="ml-1 w-3 h-3" />}
      </Link>
    </li>
  );
};

export default Footer;
