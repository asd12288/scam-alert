import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getBlogPosts, type BlogPost } from "@/lib/supabase";
import {
  Clock,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Shield,
} from "lucide-react";

export const metadata = {
  title: "Blogs | AI Scam Alert",
  description:
    "Latest articles and insights about AI-detected online scams and prevention strategies",
};

// Enhanced sample blog posts with more detailed content and additional posts
const SAMPLE_POSTS: BlogPost[] = [
  {
    id: 1,
    title:
      "AI Voice Cloning Scams: How Criminals Are Impersonating Your Loved Ones",
    summary:
      "The alarming rise of AI voice cloning technology used by scammers to create fake emergency calls from family members requesting immediate financial help.",
    content: "",
    image_url: "/placeholder-blog-1.jpg",
    published_at: "2025-04-12T10:00:00Z",
    slug: "ai-voice-cloning-scams",
    author: "Dr. Sophia Chen",
    author_title: "Cybersecurity Researcher",
    author_image: "/experts/sophia-chen.jpg",
    category: "AI Scams",
    reading_time: "6 min read",
    featured: true,
    tags: ["AI", "Voice Cloning", "Deepfake", "Family Scams"],
  },
  {
    id: 2,
    title:
      "Pig Butchering Scam: The $1B Investment Fraud Taking Over Dating Apps",
    summary:
      "How criminals are using romance and friendship as a pretext for sophisticated cryptocurrency investment scams that drain victims' savings.",
    content: "",
    image_url: "/placeholder-blog-2.jpg",
    published_at: "2025-04-11T10:00:00Z",
    slug: "pig-butchering-investment-scams",
    author: "Marcus Johnson",
    author_title: "Financial Crime Analyst",
    author_image: "/experts/marcus-johnson.jpg",
    category: "Investment Fraud",
    reading_time: "8 min read",
    featured: true,
    tags: ["Cryptocurrency", "Dating Apps", "Investment", "Romance Scams"],
  },
  {
    id: 3,
    title: "Common Phishing Techniques to Watch For in 2025",
    summary:
      "Learn how to identify and avoid the latest phishing attempts targeting online users, including new tactics that bypass traditional security measures.",
    content: "",
    image_url: "/placeholder-blog-3.jpg",
    published_at: "2025-04-09T10:00:00Z",
    slug: "common-phishing-techniques",
    author: "Security Expert Team",
    author_title: "Threat Intelligence",
    author_image: "/experts/security-team.jpg",
    category: "Phishing",
    reading_time: "5 min read",
    featured: false,
    tags: [
      "Email Security",
      "Phishing",
      "Credential Theft",
      "Corporate Attacks",
    ],
  },
  {
    id: 4,
    title: "How to Spot Fake Online Stores: The Checkout Page Giveaways",
    summary:
      "Protect yourself from fraudulent online shops with these key verification steps and learn the red flags in payment processing that indicate a scam.",
    content: "",
    image_url: "/placeholder-blog-4.jpg",
    published_at: "2025-04-07T10:00:00Z",
    slug: "spot-fake-online-stores",
    author: "Consumer Protection Team",
    author_title: "E-commerce Safety",
    author_image: "/experts/consumer-team.jpg",
    category: "Online Shopping",
    reading_time: "4 min read",
    featured: false,
    tags: ["E-commerce", "Payment Fraud", "Shopping Safety", "Product Scams"],
  },
  {
    id: 5,
    title: "Social Media Verification Badge Scams Explode in 2025",
    summary:
      "The latest tactics scammers are using on social platforms to trick users into paying for fake verification services and how platforms are responding.",
    content: "",
    image_url: "/placeholder-blog-5.jpg",
    published_at: "2025-04-05T10:00:00Z",
    slug: "social-media-verification-scams",
    author: "Digital Safety Advisor",
    author_title: "Social Media Expert",
    author_image: "/experts/digital-advisor.jpg",
    category: "Social Media",
    reading_time: "7 min read",
    featured: false,
    tags: ["Social Media", "Verification", "Identity Theft", "Influencers"],
  },
  {
    id: 6,
    title: "The Government Impersonation Scam Costing Americans Millions",
    summary:
      "How scammers are posing as government officials to extract payments and personal information from unsuspecting citizens, with case studies and prevention tips.",
    content: "",
    image_url: "/placeholder-blog-6.jpg",
    published_at: "2025-04-03T10:00:00Z",
    slug: "government-impersonation-scams",
    author: "James Wilson",
    author_title: "Former FBI Cybercrime Unit",
    author_image: "/experts/james-wilson.jpg",
    category: "Government Scams",
    reading_time: "9 min read",
    featured: false,
    tags: [
      "IRS Scams",
      "Government Impersonation",
      "Phone Scams",
      "Legal Threats",
    ],
  },
];

// All unique tags from the blog posts for filtering
const allTags = Array.from(
  new Set(SAMPLE_POSTS.flatMap((post) => post.tags || []))
);

export default async function BlogsPage() {
  // In production, this would fetch from Supabase
  // const posts = await getBlogPosts();
  const posts = SAMPLE_POSTS; // Using sample data for now

  // Separate featured posts from regular posts
  const featuredPosts = posts.filter((post) => post.featured);
  const regularPosts = posts.filter((post) => !post.featured);

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

      {/* Trending Topics Section */}
      <div className="mb-10">
        <div className="flex items-center mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">
            Trending Topics
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm hover:bg-[rgba(59,130,246,0.05)] hover:border-blue-500 transition-colors text-gray-700"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Posts Section */}
      {featuredPosts.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <AlertTriangle className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              Urgent Scam Alerts
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {featuredPosts.map((post) => (
              <article
                key={post.id}
                className="border border-[rgba(59,130,246,0.2)] rounded-lg overflow-hidden shadow-md bg-white relative"
              >
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Featured Alert
                  </span>
                </div>

                <div className="h-56 bg-[#f0f7ff] relative">
                  {/* Image placeholder - in production, this would use the actual image URL */}
                  <div className="w-full h-full bg-[#f0f7ff] flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-[rgba(59,130,246,0.3)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-[rgba(59,130,246,0.1)] text-blue-600 text-xs font-medium rounded">
                      {post.category}
                    </span>
                    <div className="flex items-center text-gray-500 text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {post.reading_time}
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold mb-3 text-gray-900 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.summary}
                  </p>

                  <div className="flex items-center justify-between border-t pt-4 mt-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2">
                        {post.author.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{post.author}</p>
                        <p className="text-xs text-gray-500">
                          {post.author_title}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/blogs/${post.slug}`}
                      className="flex items-center text-blue-600 hover:underline font-medium"
                    >
                      Read full analysis{" "}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Regular Posts Section */}
      <div>
        <div className="flex items-center mb-6">
          <Shield className="w-5 h-5 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">
            Latest Scam Insights
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {regularPosts.map((post) => (
            <article
              key={post.id}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <div className="h-48 bg-[#f0f7ff] relative">
                {/* Image placeholder - in production, this would use the actual image URL */}
                <div className="w-full h-full bg-[#f0f7ff] flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-[rgba(59,130,246,0.3)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-[rgba(59,130,246,0.1)] text-blue-600 text-xs font-medium rounded">
                    {post.category}
                  </span>
                  <div className="flex items-center text-gray-500 text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {post.reading_time}
                  </div>
                </div>

                <h2 className="text-xl font-semibold mb-2 text-gray-900 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.summary}
                </p>

                {post.tags && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between border-t pt-3">
                  <time className="text-xs text-gray-500">
                    {new Date(post.published_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                  <Link
                    href={`/blogs/${post.slug}`}
                    className="text-blue-600 hover:underline text-sm font-medium"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

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
