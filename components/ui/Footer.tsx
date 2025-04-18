import React from "react";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-gray-500 text-sm">
          <p>
            © {currentYear} Scam Protector. All rights reserved.
          </p>
        </div>
        <div className="flex justify-center space-x-6 mt-4">
          <Link href="/legal" className="text-gray-500 hover:text-gray-900 text-sm">
            Legal
          </Link>
          <Link href="/privacy" className="text-gray-500 hover:text-gray-900 text-sm">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
