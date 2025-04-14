"use client";

import React from "react";
import Link from "next/link";
import {
  Home,
  BookOpen,
  FileText,
  AlertTriangle,
  Shield,
  Menu,
  X,
} from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Name */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <span className="font-semibold text-xl text-blue-600">
              AI Scam Alert
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink
              href="/"
              icon={<Home className="w-4 h-4" />}
              label="Home"
            />
            <NavLink
              href="/guide"
              icon={<BookOpen className="w-4 h-4" />}
              label="Guide"
            />
            <NavLink
              href="/blogs"
              icon={<FileText className="w-4 h-4" />}
              label="Blog"
            />
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 flex items-center transition-colors ml-2"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              <span>Report Scam</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none focus:text-blue-600"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-4 space-y-1 border-t border-gray-100">
            <MobileNavLink
              href="/"
              label="Home"
              icon={<Home className="w-5 h-5" />}
            />
            <MobileNavLink
              href="/guide"
              label="Scam Guide"
              icon={<BookOpen className="w-5 h-5" />}
            />
            <MobileNavLink
              href="/blogs"
              label="Blog Articles"
              icon={<FileText className="w-5 h-5" />}
            />
            <div className="pt-2 mt-3 border-t border-gray-100">
              <Link
                href="/"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-3 flex items-center transition-colors w-full"
              >
                <AlertTriangle className="w-5 h-5 mr-2" />
                <span>Report a Possible Scam</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

const NavLink = ({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) => {
  return (
    <Link
      href={href}
      className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg px-3 py-2 text-sm font-medium flex items-center transition-colors"
    >
      <span className="mr-1.5">{icon}</span>
      {label}
    </Link>
  );
};

const MobileNavLink = ({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) => {
  return (
    <Link
      href={href}
      className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 block rounded-lg px-3 py-2.5 text-base font-medium flex items-center"
    >
      <span className="mr-3 text-gray-500">{icon}</span>
      {label}
    </Link>
  );
};

export default Header;
