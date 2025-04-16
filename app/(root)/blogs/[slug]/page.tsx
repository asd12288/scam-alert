import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Shield } from "lucide-react";
import { getBlogPostBySlug } from "@/lib/supabase";
import { format, isValid, parseISO } from "date-fns";
import ClientCommentsWrapper from "@/components/ClientCommentsWrapper";
import ShareButtons from "@/components/ShareButtons";
import { headers } from "next/headers";

// Mark this page for dynamic rendering to avoid build errors
export const dynamic = "force-dynamic";

// Helper function to safely format dates
const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "Invalid date";

  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return "Invalid date";
    return format(date, "MMMM d, yyyy");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

// Next.js Server Component - uses async/await pattern for data fetching
export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  // Access params directly since we're not using React.use() anymore
  const { slug } = params;

  // Fetch blog post data with error handling
  let post = null;
  try {
    post = await getBlogPostBySlug(slug);
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    // Continue with post as null, which will show the not found view
  }

  // Get the current URL for sharing
  const headersList = headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const fullUrl = `${protocol}://${host}/blogs/${slug}`;

  if (!post) {
    // Instead of showing 404, show a placeholder for development
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Link
          href="/blogs"
          className="inline-flex items-center text-blue-700 mb-6 hover:underline font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to all articles
        </Link>

        <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
          <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Blog Content Coming Soon
          </h1>
          <p className="text-xl text-gray-600 max-w-lg mx-auto mb-8">
            This blog post doesn&#39;t exist yet. We&#39;re working on creating
            valuable content to help you stay protected from online scams.
          </p>
          <p className="text-gray-500 mb-8">
            Requested slug:{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">{slug}</code>
          </p>
          <Link
            href="/blogs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            Return to Blog Listing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-10">
      <Link
        href="/blogs"
        className="inline-flex items-center text-blue-700 mb-6 hover:underline font-medium"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to all articles
      </Link>

      {/* Blog header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <time dateTime={post.created_at}>
              {formatDate(post.created_at)}
            </time>
          </div>
          {post.author && (
            <div className="flex items-center">
              <span>By {post.author}</span>
            </div>
          )}
        </div>
      </header>

      {/* Featured image */}
      {post.featured_image && (
        <div className="mb-10 -mx-4 md:mx-0 overflow-hidden rounded-lg">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {/* Blog content */}
      <div
        className="prose prose-lg max-w-none mb-10"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-10 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Topics</h2>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
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

      {/* Share buttons */}
      <ShareButtons title={post.title} url={fullUrl} excerpt={post.excerpt} />

      {/* Comments section */}
      <ClientCommentsWrapper blogPostId={post.id} />
    </article>
  );
}
