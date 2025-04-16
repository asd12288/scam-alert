"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Users,
  Home,
  Shield,
  Settings,
  FileText,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, loading, user, authInitialized } = useAuth();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  // Handle auth state changes more efficiently
  useEffect(() => {
    // Only check admin status AFTER authentication is fully initialized
    if (authInitialized && !authChecked) {
      setAuthChecked(true);

      console.log(`[AdminLayout] Auth initialized, admin status: ${isAdmin}`);

      if (!isAdmin) {
        console.log("[AdminLayout] Not admin, redirecting to home");
        router.replace("/");
      }
    }
  }, [isAdmin, authInitialized, router, authChecked]);

  // Show loading state while authentication is still initializing
  if (!authInitialized || (loading && !authChecked)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-300 border-t-slate-600 mb-2"></div>
          <p className="text-gray-500">Loading admin panel...</p>
          <p className="text-xs text-gray-400 mt-2">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  // For non-admins who haven't been redirected yet, show minimal UI
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-300 border-t-slate-600 mb-2"></div>
          <p className="text-gray-500">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // If we get here, user is definitely admin
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Admin sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <Link href="/" className="flex items-center mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="font-semibold">Back to site</span>
          </Link>
          <h2 className="text-xl font-bold text-gray-800 mb-6">Admin Panel</h2>

          <nav className="space-y-1">
            <Link
              href="/admin"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md"
            >
              <Home className="w-5 h-5 mr-3" />
              Dashboard
            </Link>

            {/* Blog Management Section */}
            <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-medium uppercase tracking-wider text-gray-500">
                Content Management
              </p>
            </div>

            <Link
              href="/admin/blogs"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md"
            >
              <FileText className="w-5 h-5 mr-3" />
              Manage Blogs
            </Link>

            <Link
              href="/admin/blogs/new"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md"
            >
              <Plus className="w-5 h-5 mr-3" />
              New Blog Post
            </Link>

            <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-medium uppercase tracking-wider text-gray-500">
                System
              </p>
            </div>

            <Link
              href="/admin/users"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md"
            >
              <Users className="w-5 h-5 mr-3" />
              User Management
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md"
            >
              <Shield className="w-5 h-5 mr-3" />
              Security Settings
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md"
            >
              <Settings className="w-5 h-5 mr-3" />
              System Settings
            </Link>
          </nav>
        </div>
      </aside>

      {/* Admin content area */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
