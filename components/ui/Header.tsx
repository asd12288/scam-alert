"use client";

import { useAuth } from "@/lib/AuthContext";
import { signOut } from "@/lib/supabase";
import {
  AlertTriangle,
  BookOpen,
  ChevronDown,
  FileText,
  LogIn,
  LogOut,
  Menu,
  Search,
  Shield,
  User,
  X,
  Download,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  // Set mounted state after component mounts on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Handle click outside of profile menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current && 
        profileButtonRef.current &&
        !profileMenuRef.current.contains(event.target as Node) &&
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  const handleSignOut = async () => {
    console.log("[Header] Signing out user");
    await signOut();
    router.push("/");
    router.refresh();
    setIsProfileMenuOpen(false);
  };

  // Close menu when escape key is pressed
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsProfileMenuOpen(false);
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, []);

  // Render optimized auth UI that doesn't wait for full loading
  const renderAuthSection = () => {
    // When not mounted yet (SSR), show nothing in place of auth controls
    if (!mounted) return null;

    // Show minimal loading state only briefly
    if (loading && !user) {
      return (
        <div className="h-9 w-20 md:ml-4 bg-gray-100 rounded-lg animate-pulse"></div>
      );
    }

    if (user) {
      return (
        <div className="relative ml-4">
          <button
            ref={profileButtonRef}
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 rounded-lg px-2 sm:px-3 py-2 text-sm font-medium transition-colors border border-gray-200 hover:border-blue-200"
            aria-expanded={isProfileMenuOpen}
            aria-haspopup="true"
          >
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <User className="w-3 h-3" />
            </div>
            <span className="hidden sm:inline">Account</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {isProfileMenuOpen && (
            <div 
              ref={profileMenuRef}
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50"
              role="menu"
            >
              <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                <div className="font-medium">
                  {user.user_metadata.name || user.email}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {user.email}
                </div>
              </div>

              {/* Admin Panel Link - Show once we definitely know user is admin */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  onClick={() => setIsProfileMenuOpen(false)}
                  role="menuitem"
                >
                  <Shield className="w-4 h-4 mr-2 text-gray-500" />
                  Admin Panel
                </Link>
              )}

              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center hover:cursor-pointer"
                role="menuitem"
              >
                <LogOut className="w-4 h-4 mr-2 text-gray-500" />
                Sign out
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        href="/login"
        className="text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-lg px-3 py-2 text-sm font-medium flex items-center transition-colors ml-3"
      >
        <LogIn className="w-4 h-4 mr-1.5" />
        Sign in
      </Link>
    );
  };

  // Similar function for mobile auth section
  const renderMobileAuthSection = () => {
    // When not mounted yet (SSR), return nothing
    if (!mounted) return null;

    // For loading state, show placeholder
    if (loading && !user) {
      return (
        <div className="px-3 py-2.5 border-t border-gray-100 mt-2 pt-2">
          <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
        </div>
      );
    }

    if (user) {
      return (
        <>
          <div className="px-3 py-3 border-t border-gray-100 mt-2 pt-2">
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
      );
    }

    return (
      <MobileNavLink
        href="/login"
        label="Sign in"
        icon={<LogIn className="w-5 h-5" />}
      />
    );
  };

  // Determine if current path matches the nav link
  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') {
      return false;
    }
    return pathname?.startsWith(path);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo and Name */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="font-semibold text-lg sm:text-xl text-blue-600">
              Scam Protector
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {/* Scan button - Most prominent */}
            <Link
              href="/"
              className={`${
                isActive('/') 
                ? 'bg-blue-700 text-white' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
              } rounded-lg px-4 py-2 flex items-center transition-colors mr-3`}
            >
              <Search className="w-4 h-4 mr-2" />
              <span>Scan Website</span>
            </Link>

            <NavLink
              href="/guide"
              icon={<BookOpen className="w-4 h-4" />}
              label="Guide"
              isActive={isActive('/guide')}
            />
            <NavLink
              href="/blogs"
              icon={<FileText className="w-4 h-4" />}
              label="Blog"
              isActive={isActive('/blogs')}
            />
            <NavLink
              href="/report"
              icon={<AlertTriangle className="w-4 h-4" />}
              label="Report Scam"
              isActive={isActive('/report')}
            />
            <NavLink
              href="/extension"
              icon={<Download className="w-4 h-4" />}
              label="Extension"
              isActive={isActive('/extension')}
            />

            {/* User Authentication - Optimized with separate render function */}
            {renderAuthSection()}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none focus:text-blue-600 p-1"
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
        <div className="md:hidden absolute w-full bg-white shadow-lg border-b border-gray-200 z-40 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
          <div className="px-2 pt-2 pb-4 space-y-1">
            {/* Primary action first for mobile */}
            <div className="pt-2 mb-3">
              <Link
                href="/"
                className={`${
                  isActive('/') 
                  ? 'bg-blue-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
                } text-white rounded-lg px-4 py-3 flex items-center transition-colors w-full`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Search className="w-5 h-5 mr-2" />
                <span>Scan Website</span>
              </Link>
            </div>

            <MobileNavLink
              href="/guide"
              label="Scam Guide"
              icon={<BookOpen className="w-5 h-5" />}
              isActive={isActive('/guide')}
            />
            <MobileNavLink
              href="/blogs"
              label="Blog Articles"
              icon={<FileText className="w-5 h-5" />}
              isActive={isActive('/blogs')}
            />
            <MobileNavLink
              href="/report"
              label="Report a Scam"
              icon={<AlertTriangle className="w-5 h-5" />}
              isActive={isActive('/report')}
            />
            <MobileNavLink
              href="/extension"
              label="Extension"
              icon={<Download className="w-5 h-5" />}
              isActive={isActive('/extension')}
            />

            {/* Mobile Authentication Links - Optimized with separate render function */}
            {renderMobileAuthSection()}
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
  isActive,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
}) => {
  return (
    <Link
      href={href}
      className={`${
        isActive 
        ? 'text-blue-600 bg-blue-50' 
        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
      } rounded-lg px-3 py-2 text-sm font-medium flex items-center transition-colors`}
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
  isActive,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
}) => {
  return (
    <Link
      href={href}
      className={`${
        isActive 
        ? 'text-blue-600 bg-blue-50' 
        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
      } block rounded-lg px-3 py-2.5 text-base font-medium flex items-center`}
    >
      <span className={`mr-3 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>{icon}</span>
      {label}
    </Link>
  );
};

export default Header;
