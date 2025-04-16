"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import {
  User,
  BarChart2,
  Users,
  AlertTriangle,
  FileEdit,
  Plus,
  Edit,
  ChevronRight,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { getBlogPosts } from "@/lib/services/blogService";
import type { BlogPost } from "@/lib/services/blogService";

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [stats, setStats] = useState({
    publishedPosts: 0,
    draftPosts: 0,
    totalPosts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogData() {
      try {
        const posts = await getBlogPosts();
        const publishedPosts = posts.filter((post) => post.published);
        const draftPosts = posts.filter((post) => !post.published);

        setRecentPosts(posts.slice(0, 5));
        setStats({
          publishedPosts: publishedPosts.length,
          draftPosts: draftPosts.length,
          totalPosts: posts.length,
        });
      } catch (error) {
        console.error("Error fetching blog data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogData();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex items-center">
          <div className="bg-blue-100 text-blue-700 rounded-full h-8 w-8 flex items-center justify-center mr-2">
            <User className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium">{profile?.name || profile?.email}</p>
            <p className="text-sm text-blue-700 font-medium">Admin</p>
          </div>
        </div>
      </div>

      {/* Blog Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">
              Published Posts
            </h3>
            <span className="bg-green-100 p-2 rounded-lg">
              <FileEdit className="h-5 w-5 text-green-600" />
            </span>
          </div>
          {loading ? (
            <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
          ) : (
            <p className="text-3xl font-semibold text-gray-900">
              {stats.publishedPosts}
            </p>
          )}
          <p className="text-sm text-gray-600 mt-1">Live on your website</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Draft Posts</h3>
            <span className="bg-yellow-100 p-2 rounded-lg">
              <Edit className="h-5 w-5 text-yellow-600" />
            </span>
          </div>
          {loading ? (
            <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
          ) : (
            <p className="text-3xl font-semibold text-gray-900">
              {stats.draftPosts}
            </p>
          )}
          <p className="text-sm text-gray-600 mt-1">Posts in progress</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Total Posts</h3>
            <span className="bg-blue-100 p-2 rounded-lg">
              <BarChart2 className="h-5 w-5 text-blue-600" />
            </span>
          </div>
          {loading ? (
            <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
          ) : (
            <p className="text-3xl font-semibold text-gray-900">
              {stats.totalPosts}
            </p>
          )}
          <p className="text-sm text-gray-600 mt-1">All-time blog posts</p>
        </div>
      </div>

      {/* Recent Blog Posts */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Recent Blog Posts
          </h2>
          <Link
            href="/admin/blogs"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
          >
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-300 border-t-slate-600 mb-2"></div>
              <p className="text-gray-500">Loading blog posts...</p>
            </div>
          ) : recentPosts.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">No blog posts yet</p>
              <Link
                href="/admin/blogs/new"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <Plus size={16} className="mr-1" />
                Create Your First Post
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {recentPosts.map((post) => (
                <li key={post.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-gray-900 font-medium">
                        {post.title}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1 line-clamp-1">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {post.published ? (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Published
                        </span>
                      ) : (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Draft
                        </span>
                      )}
                      <Link
                        href={`/admin/blogs/${post.id}/edit`}
                        className="text-blue-600 hover:text-blue-900 p-1"
                      >
                        <Edit size={16} />
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/blogs/new"
            className="bg-blue-500 text-white p-5 rounded-lg shadow-sm text-left hover:bg-blue-600 hover:shadow transition-all"
          >
            <h3 className="font-medium mb-1 flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Create New Blog Post
            </h3>
            <p className="text-sm text-blue-100">
              Write and publish a new article
            </p>
          </Link>

          <Link
            href="/admin/blogs"
            className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 text-left hover:border-blue-500 hover:shadow transition-all"
          >
            <h3 className="font-medium mb-1 flex items-center">
              <FileEdit className="w-5 h-5 mr-2" />
              Manage Blog Posts
            </h3>
            <p className="text-sm text-gray-500">
              Edit and organize your content
            </p>
          </Link>

          <Link
            href="/admin/users"
            className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 text-left hover:border-blue-500 hover:shadow transition-all"
          >
            <h3 className="font-medium mb-1 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Manage Users
            </h3>
            <p className="text-sm text-gray-500">Add or remove user accounts</p>
          </Link>

          <Link
            href="/admin/settings"
            className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 text-left hover:border-blue-500 hover:shadow transition-all"
          >
            <h3 className="font-medium mb-1 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              System Settings
            </h3>
            <p className="text-sm text-gray-500">
              Configure scoring weights and more
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
