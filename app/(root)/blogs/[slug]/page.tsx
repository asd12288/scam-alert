import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  MessageCircle,
  AlertTriangle,
  Shield,
} from "lucide-react";

// In a real app, this would come from getSingleBlogPost(slug) database call
// Placeholder for demonstration purposes
const getBlogPostBySlug = (slug: string) => {
  // This would typically be fetched from a database
  const posts = [
    {
      id: 1,
      title:
        "AI Voice Cloning Scams: How Criminals Are Impersonating Your Loved Ones",
      summary:
        "The alarming rise of AI voice cloning technology used by scammers to create fake emergency calls from family members requesting immediate financial help.",
      content: `
        <p>The call comes in the middle of the night. A panicked voice that sounds exactly like your daughter says, "Mom, I've been in an accident. I need help." Your heart races as she explains she needs money immediately to cover hospital bills or legal fees.</p>
        
        <p>But it's not your daughter. It's an AI-generated clone of her voice, created from samples harvested from her public social media videos or from a brief earlier phone call that seemed innocuous at the time.</p>
        
        <h2>How Voice Cloning Scams Work</h2>
        
        <p>Voice cloning technology has advanced rapidly, allowing scammers to create convincing voice replicas from just a few seconds of audio. Here's how these scams typically unfold:</p>
        
        <ol>
          <li><strong>Data Harvesting</strong>: Scammers collect voice samples from public social media posts, professional recordings, or through brief "wrong number" calls designed to get you talking.</li>
          <li><strong>Voice Synthesis</strong>: Using AI tools, they create a synthetic voice that matches the target's speech patterns, accent, and vocal characteristics.</li>
          <li><strong>Emergency Scenario</strong>: The scammer calls a family member, using the cloned voice to create a fake emergency that requires immediate financial assistance.</li>
          <li><strong>Pressure Tactics</strong>: They add urgency and emotional manipulation to prevent the victim from verifying the situation with the real family member.</li>
        </ol>
        
        <div class="warning-box">
          <h3>Real-World Impact</h3>
          <p>In March 2025, a Cleveland family lost $18,000 after receiving what they believed was a call from their son claiming to be in jail needing bail money. The voice was indistinguishable from their son's, but he had been at work the entire time, unaware of the scam.</p>
        </div>
        
        <h2>How to Protect Yourself</h2>
        
        <p>As this technology becomes more accessible, protecting yourself requires new layers of verification:</p>
        
        <ul>
          <li><strong>Establish a "safe word" or verification question</strong> with close family members that would be difficult for an AI to know.</li>
          <li><strong>Always verify independently</strong> by calling the person back on their known number, even if the emergency seems urgent.</li>
          <li><strong>Be suspicious of calls requesting money transfers</strong>, gift cards, or cryptocurrency payments.</li>
          <li><strong>Keep social media accounts private</strong> and limit the amount of public voice content available online.</li>
          <li><strong>Consider using voice authentication apps</strong> for family communication during emergencies.</li>
        </ul>
        
        <h2>The Technology Behind the Scam</h2>
        
        <p>Voice cloning is powered by machine learning models that analyze the patterns, cadence, and unique characteristics of a voice. What previously required hours of recorded audio can now be accomplished with as little as three seconds of clear speech.</p>
        
        <p>Commercial applications of this technology include audiobook narration, accessibility tools for those who have lost their voice, and voice acting. However, the same technology in malicious hands creates perfect tools for impersonation.</p>
        
        <h2>What to Do If You've Been Targeted</h2>
        
        <p>If you believe you've received a call using a cloned voice:</p>
        
        <ul>
          <li>Report the incident to local law enforcement</li>
          <li>File a report with the FBI's Internet Crime Complaint Center (IC3)</li>
          <li>Alert family members about the potential compromise</li>
          <li>Document everything about the call, including the number it came from</li>
        </ul>
        
        <p>Law enforcement agencies are developing new methods to track these scams, but prevention remains the most effective protection. Always verify unexpected emergency calls through separate channels, regardless of how convincing the voice sounds.</p>
      `,
      image_url: "/placeholder-blog-1.jpg",
      published_at: "2025-04-12T10:00:00Z",
      slug: "ai-voice-cloning-scams",
      author: "Dr. Sophia Chen",
      author_title: "Cybersecurity Researcher",
      author_bio:
        "Dr. Chen specializes in AI ethics and security vulnerabilities. She has published extensively on emerging technologies and their potential for misuse in fraud scenarios.",
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
      content: `
        <p>Sarah matched with "Michael" on a dating app in January. A successful financial analyst from London temporarily working in the U.S., he seemed perfect - attentive, successful, and genuinely interested in her life. After weeks of daily conversation, Michael mentioned the cryptocurrency investments that had built his wealth.</p>
        
        <p>Three months and $200,000 later, Sarah discovered she'd been targeted by a sophisticated "pig butchering" scam that combined romance fraud with fake investment platforms. By the time she realized what happened, her money was gone.</p>

        <h2>What is "Pig Butchering"?</h2>
        
        <p>The term "pig butchering" (sha zhu pan) originates from the scammer's strategy of "fattening up" victims before "slaughtering" them financially. Unlike traditional romance scams that directly ask for money for emergencies, these scammers play a longer game:</p>

        <ol>
          <li><strong>Cultivation</strong>: Building trust over weeks or months, often through dating apps, social media, or even wrong number texts that evolve into friendships</li>
          <li><strong>Introduction to investing</strong>: Casually mentioning their success with investments, particularly cryptocurrency</li>
          <li><strong>Demonstration</strong>: Showing screenshots of their substantial returns on legitimate-looking (but fake) investment platforms</li>
          <li><strong>Guided investment</strong>: Helping victims make initial small investments that show immediate "returns"</li>
          <li><strong>The push for more</strong>: Encouraging increasingly larger investments, often prompting victims to liquidate retirement accounts or take out loans</li>
          <li><strong>The vanishing act</strong>: Disappearing completely once the victim can't invest more or begins to question the scheme</li>
        </ol>

        <div class="warning-box">
          <h3>Industry Scale</h3>
          <p>The FBI estimates that pig butchering scams cost Americans over $1 billion in 2024 alone. These operations are often run by large criminal syndicates employing thousands of scammers working from scripts, sometimes against their will in "scam compounds" in Southeast Asia.</p>
        </div>
        
        <h2>Red Flags to Watch For</h2>
        
        <p>These sophisticated scams can be difficult to identify, but certain patterns emerge:</p>
        
        <ul>
          <li><strong>Too-perfect profiles</strong> featuring attractive, successful professionals (often using stolen photos)</li>
          <li><strong>Quick relationship progression</strong> despite never meeting in person</li>
          <li><strong>Investment platforms you can't find</strong> through independent research</li>
          <li><strong>Custom apps or websites</strong> not available in app stores</li>
          <li><strong>Pressure to act quickly</strong> on "limited time" investment opportunities</li>
          <li><strong>Inability to withdraw funds</strong> or requirements to pay taxes/fees to access your money</li>
        </ul>
        
        <h2>Protection Strategies</h2>
        
        <p>The most effective protection is awareness and skepticism:</p>
        
        <ul>
          <li>Research investment opportunities independently - never rely solely on links provided by others</li>
          <li>Verify the legitimacy of investment platforms through financial regulatory bodies</li>
          <li>Be wary of anyone directing you to specific investment websites, particularly if you met them online</li>
          <li>Remember that legitimate investment opportunities don't require urgency or secrecy</li>
          <li>Video chat early in online relationships to verify identity</li>
          <li>Discuss investment opportunities with trusted financial advisors before committing funds</li>
        </ul>
        
        <p>If you believe you've been targeted, report to the FBI's Internet Crime Complaint Center (IC3) and the FTC. While recovery of funds is difficult, your report helps authorities build cases against these criminal networks.</p>
      `,
      image_url: "/placeholder-blog-2.jpg",
      published_at: "2025-04-11T10:00:00Z",
      slug: "pig-butchering-investment-scams",
      author: "Marcus Johnson",
      author_title: "Financial Crime Analyst",
      author_bio:
        "Marcus Johnson spent 15 years investigating financial fraud with the SEC before joining the private sector. He now works with victims of investment scams and educates the public on emerging threats.",
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
      content: "Full article content here...",
      slug: "common-phishing-techniques",
      // other properties
    },
    // More posts would be here
  ];

  return posts.find((post) => post.slug === slug);
};

// Get related posts based on tags
const getRelatedPosts = (currentPost: any, allPosts: any[], count = 3) => {
  if (!currentPost.tags || !currentPost.tags.length) return [];

  return allPosts
    .filter((post) => post.id !== currentPost.id) // Exclude current post
    .map((post) => {
      // Calculate relevance score based on tag overlap
      const relevanceScore = post.tags
        ? post.tags.filter((tag: string) => currentPost.tags.includes(tag))
            .length
        : 0;
      return { ...post, relevanceScore };
    })
    .filter((post) => post.relevanceScore > 0) // Only include posts with at least one matching tag
    .sort((a, b) => b.relevanceScore - a.relevanceScore) // Sort by relevance
    .slice(0, count);
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // This would contain all posts in a real implementation
  const allPosts = [
    // ... all posts would be here
  ];

  const relatedPosts = getRelatedPosts(post, allPosts, 2);

  return (
    <article className="max-w-6xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        href="/blogs"
        className="inline-flex items-center text-blue-700 mb-6 hover:underline font-medium"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to all articles
      </Link>

      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-wrap gap-3 items-center mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {post.category}
          </span>
          <div className="flex items-center text-gray-600 text-sm">
            <Calendar className="w-4 h-4 mr-1" />
            <time dateTime={post.published_at}>
              {new Date(post.published_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Clock className="w-4 h-4 mr-1" />
            {post.reading_time}
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <p className="text-xl text-gray-700 mb-6">{post.summary}</p>

        {/* Author info */}
        <div className="flex items-center p-6 bg-blue-50 border border-blue-100 rounded-lg shadow-sm">
          <div className="w-16 h-16 bg-blue-600 rounded-full mr-5 overflow-hidden flex items-center justify-center">
            {/* This would be an actual image in production */}
            <span className="text-xl font-bold text-white">
              {post.author.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-bold text-lg">{post.author}</h3>
            <p className="text-blue-700 font-medium">{post.author_title}</p>
            <p className="text-sm text-gray-600 mt-1 max-w-2xl">
              {post.author_bio}
            </p>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="mb-10 bg-blue-50 rounded-xl h-[400px] flex items-center justify-center overflow-hidden shadow-md">
        {/* This would be an actual image in production */}
        <svg
          className="w-24 h-24 text-blue-400"
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

      {/* Content */}
      <div className="prose prose-lg max-w-none mb-12">
        <div
          dangerouslySetInnerHTML={{ __html: post.content }}
          className="prose-headings:text-blue-900 prose-a:text-blue-700 prose-a:font-medium"
        />
      </div>

      {/* Share and engagement section */}
      <div className="border-t border-b border-gray-200 py-6 my-10">
        <div className="flex flex-wrap justify-between items-center">
          <div>
            <h3 className="text-lg font-medium mb-2">Share this article</h3>
            <div className="flex space-x-3">
              <button className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors">
                <Facebook className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors">
                <Linkedin className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors">
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mt-4 md:mt-0">
            <Link
              href="#"
              className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Discuss this article
            </Link>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="mb-10">
        <h3 className="text-lg font-medium mb-3">Related topics</h3>
        <div className="flex flex-wrap gap-2">
          {post.tags &&
            post.tags.map((tag: string, index: number) => (
              <Link
                key={index}
                href={`/blogs?tag=${encodeURIComponent(tag)}`}
                className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-blue-100 hover:text-blue-800 transition-colors"
              >
                {tag}
              </Link>
            ))}
        </div>
      </div>

      {/* Related articles */}
      {relatedPosts && relatedPosts.length > 0 && (
        <div className="mt-12 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Related Articles
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {relatedPosts.map((relatedPost: any) => (
              <div
                key={relatedPost.id}
                className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-40 bg-blue-50 flex items-center justify-center">
                  {/* Placeholder image */}
                  <svg
                    className="w-12 h-12 text-blue-300"
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
                <div className="p-5">
                  <div className="flex items-center mb-2">
                    <span className="text-sm text-blue-700 font-medium">
                      {relatedPost.category}
                    </span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-sm text-gray-500">
                      {relatedPost.reading_time}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">
                    <Link
                      href={`/blogs/${relatedPost.slug}`}
                      className="hover:text-blue-700"
                    >
                      {relatedPost.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {relatedPost.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA section */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-8 my-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 mb-6 md:mb-0 md:mr-6">
            <h3 className="text-2xl font-bold text-blue-900 mb-2">
              Stay protected from scams
            </h3>
            <p className="text-blue-800">
              Get alerts about new scams and threats directly to your inbox.
              Join our community of security-conscious people.
            </p>
          </div>
          <div className="md:w-1/3">
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-2 rounded-l-lg border-y border-l border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-600 text-white font-medium px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
