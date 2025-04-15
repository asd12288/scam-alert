"use client";

import { useAuth, useRequireAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authorized, loading } = useRequireAuth("admin");
  const router = useRouter();

  useEffect(() => {
    // Redirect if not an admin and not loading
    if (!loading && !authorized) {
      router.push("/");
    }
  }, [authorized, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!authorized) {
    // This will briefly show before the redirect happens
    return null;
  }

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
              href="/admin/security"
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
