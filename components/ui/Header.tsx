"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Home,
  BookOpen,
  FileText,
  AlertTriangle,
  Shield,
  Menu,
  X,
  LogIn,
  User,
  LogOut,
  ChevronDown,
  Search,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { signOut } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Set mounted state after component mounts on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Debug logging for auth state
  useEffect(() => {
    console.log("[Header] Auth state:", {
      userExists: !!user,
      email: user?.email,
      isAdmin,
      loading,
      timestamp: new Date().toISOString(),
    });
  }, [user, isAdmin, loading]);

  const handleSignOut = async () => {
    console.log("[Header] Signing out user");
    await signOut();
    router.push("/");
    router.refresh();
    setIsProfileMenuOpen(false);
  };

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
            {/* Scan button - Most prominent */}
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 flex items-center transition-colors mr-3"
            >
              <Search className="w-4 h-4 mr-2" />
              <span>Scan Website</span>
            </Link>

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
            <NavLink
              href="/report"
              icon={<AlertTriangle className="w-4 h-4" />}
              label="Report Scam"
            />

            {/* User Authentication */}
            {!loading && (
              <>
                {user ? (
                  <div className="relative ml-4">
                    <button
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 rounded-lg px-3 py-2 text-sm font-medium transition-colors border border-gray-200 hover:border-blue-200"
                    >
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <User className="w-3 h-3" />
                      </div>
                      <span>Account</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {isProfileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50">
                        <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                          <div className="font-medium">
                            {user.user_metadata.name || user.email}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {user.email}
                          </div>
                        </div>
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <User className="w-4 h-4 mr-2 text-gray-500" />
                          Profile
                        </Link>

                        {/* Admin Panel Link - Only shown to admin users */}
                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            <Shield className="w-4 h-4 mr-2 text-gray-500" />
                            Admin Panel
                          </Link>
                        )}

                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center hover:cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 mr-2 text-gray-500" />
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-lg px-3 py-2 text-sm font-medium flex items-center transition-colors ml-3"
                  >
                    <LogIn className="w-4 h-4 mr-1.5" />
                    Sign in
                  </Link>
                )}
              </>
            )}
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
            {/* Primary action first for mobile */}
            <div className="pt-2 mb-3">
              <Link
                href="/"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-3 flex items-center transition-colors w-full"
              >
                <Search className="w-5 h-5 mr-2" />
                <span>Scan Website</span>
              </Link>
            </div>

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
            <MobileNavLink
              href="/report"
              label="Report a Scam"
              icon={<AlertTriangle className="w-5 h-5" />}
            />

            {/* Mobile Authentication Links */}
            {!loading && (
              <>
                {user ? (
                  <>
                    <div className="px-3 py-2.5 border-t border-gray-100 mt-2 pt-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">
                            {user.user_metadata.name || "User"}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </div>
                    <MobileNavLink
                      href="/profile"
                      label="Profile"
                      icon={<User className="w-5 h-5" />}
                    />

                    {/* Admin Panel Link for Mobile Menu - Only shown to admin users */}
                    {isAdmin && (
                      <MobileNavLink
                        href="/admin"
                        label="Admin Panel"
                        icon={<Shield className="w-5 h-5" />}
                      />
                    )}

                    <button
                      onClick={handleSignOut}
                      className="w-full text-left text-gray-700 hover:text-blue-600 hover:bg-blue-50 block rounded-lg px-3 py-2.5 text-base font-medium flex items-center"
                    >
                      <span className="mr-3 text-gray-500">
                        <LogOut className="w-5 h-5" />
                      </span>
                      Sign Out
                    </button>
                  </>
                ) : (
                  <MobileNavLink
                    href="/login"
                    label="Sign in"
                    icon={<LogIn className="w-5 h-5" />}
                  />
                )}
              </>
            )}
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
