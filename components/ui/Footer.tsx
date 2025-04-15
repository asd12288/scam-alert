import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-4 px-4 mt-auto border-t border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <div className="mb-4 sm:mb-0">
          <p>&copy; {currentYear} AI Scam Alert. All rights reserved.</p>
        </div>
        <nav className="flex space-x-6">
          <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/legal" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Legal
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;