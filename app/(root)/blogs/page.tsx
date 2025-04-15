import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  AlertTriangle,
  Shield,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { getBlogPosts } from "@/lib/supabase";
import { format, isValid, parseISO } from "date-fns";

// Mark the page as dynamically rendered to avoid build-time fetching errors
export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Blogs | AI Scam Alert",
  description:
    "Latest articles and insights about AI-detected online scams and prevention strategies",
};

// Helper function to safely format dates
const formatDate = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return "Invalid date";
    return format(date, "MMM d, yyyy");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

export default async function BlogsPage() {
  // Fetch published blog posts
  let posts = [];
  try {
    posts = await getBlogPosts({ onlyPublished: true });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    // Continue with empty posts array
  }

  // Extract tags from all posts
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags || [])));

  // Select featured posts (could be based on any criteria - here using first 3)
  const featuredPosts = posts.slice(0, 3);
  const regularPosts = posts.slice(3);

  return (
    <div className="py-10 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3 text-gray-900">
          AI Scam Alert Knowledge Center
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Stay informed about the latest online threats detected and analyzed by
          our AI technology, with expert commentary, real victim stories, and
          actionable prevention strategies to protect yourself and your loved
          ones.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center">
          <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Blog Content Coming Soon
          </h2>
          <p className="text-gray-600 max-w-lg mx-auto mb-6">
            We're currently working on creating valuable content to help you
            stay protected from online scams. Check back soon for articles on
            the latest scam techniques and prevention strategies.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      ) : (
        <div className="space-y-16">
          {/* Featured Posts Section */}
          {featuredPosts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {featuredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {post.featured_image && (
                      <div className="aspect-video w-full overflow-hidden">
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Calendar size={14} className="mr-1" />
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-900">
                        <Link
                          href={`/blogs/${post.slug}`}
                          className="hover:text-blue-700"
                        >
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <Link
                        href={`/blogs/${post.slug}`}
                        className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                      >
                        Read more <ArrowRight size={16} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regular Posts Section */}
          {regularPosts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Calendar size={14} className="mr-1" />
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-900">
                        <Link
                          href={`/blogs/${post.slug}`}
                          className="hover:text-blue-700"
                        >
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <Link
                        href={`/blogs/${post.slug}`}
                        className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                      >
                        Read more <ArrowRight size={16} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags Section */}
          {allTags.length > 0 && (
            <div className="mt-16">
              <h3 className="text-xl font-semibold mb-4">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Newsletter Signup */}
      <div className="mt-16 bg-[#f0f7ff] border border-[rgba(59,130,246,0.2)] rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold mb-3 text-gray-900">
          Stay Protected
        </h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Subscribe to our weekly scam alert newsletter and get timely warnings
          about emerging threats before they reach the mainstream news.
        </p>
        <div className="flex max-w-md mx-auto">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-grow border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button className="bg-blue-600 text-white px-6 py-2 rounded-r-lg hover:bg-blue-700 transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}
