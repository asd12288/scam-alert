import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Share2, Facebook, Twitter, Linkedin, Mail, MessageCircle, AlertTriangle } from "lucide-react";

// In a real app, this would come from getSingleBlogPost(slug) database call
// Placeholder for demonstration purposes
const getBlogPostBySlug = (slug: string) => {
  // This would typically be fetched from a database
  const posts = [
    {
      id: 1,
      title: "AI Voice Cloning Scams: How Criminals Are Impersonating Your Loved Ones",
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
      author_bio: "Dr. Chen specializes in AI ethics and security vulnerabilities. She has published extensively on emerging technologies and their potential for misuse in fraud scenarios.",
      author_image: "/experts/sophia-chen.jpg",
      category: "AI Scams",
      reading_time: "6 min read",
      featured: true,
      tags: ["AI", "Voice Cloning", "Deepfake", "Family Scams"]
    },
    {
      id: 2,
      title: "Pig Butchering Scam: The $1B Investment Fraud Taking Over Dating Apps",
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
      author_bio: "Marcus Johnson spent 15 years investigating financial fraud with the SEC before joining the private sector. He now works with victims of investment scams and educates the public on emerging threats.",
      author_image: "/experts/marcus-johnson.jpg",
      category: "Investment Fraud",
      reading_time: "8 min read",
      featured: true,
      tags: ["Cryptocurrency", "Dating Apps", "Investment", "Romance Scams"]
    },
    {
      id: 3,
      title: "Common Phishing Techniques to Watch For in 2025",
      summary:
        "Learn how to identify and avoid the latest phishing attempts targeting online users, including new tactics that bypass traditional security measures.",
      content: "Full article content here...",
      slug: "common-phishing-techniques",
      // other properties
    }
    // More posts would be here
  ];
  
  return posts.find(post => post.slug === slug);
};

// Get related posts based on tags
const getRelatedPosts = (currentPost: any, allPosts: any[], count = 3) => {
  if (!currentPost.tags || !currentPost.tags.length) return [];
  
  return allPosts
    .filter(post => post.id !== currentPost.id) // Exclude current post
    .map(post => {
      // Calculate relevance score based on tag overlap
      const relevanceScore = post.tags ? 
        post.tags.filter((tag: string) => currentPost.tags.includes(tag)).length : 
        0;
      return { ...post, relevanceScore };
    })
    .filter(post => post.relevanceScore > 0) // Only include posts with at least one matching tag
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
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link 
        href="/blogs" 
        className="inline-flex items-center text-[rgb(255,77,79)] mb-6 hover:underline"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to all articles
      </Link>
      
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-wrap gap-2 items-center mb-4">
          <span className="px-3 py-1 bg-[rgba(255,77,79,0.1)] text-[rgb(255,77,79)] rounded-full text-sm font-medium">
            {post.category}
          </span>
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="w-4 h-4 mr-1" />
            <time dateTime={post.published_at}>
              {new Date(post.published_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="w-4 h-4 mr-1" />
            {post.reading_time}
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <p className="text-xl text-gray-600 mb-6">{post.summary}</p>
        
        {/* Author info */}
        <div className="flex items-center p-4 bg-[#fff8f8] border border-[rgba(255,77,79,0.2)] rounded-lg">
          <div className="w-16 h-16 bg-gray-200 rounded-full mr-4 overflow-hidden flex items-center justify-center">
            {/* This would be an actual image in production */}
            <span className="text-xl font-bold">{post.author.charAt(0)}</span>
          </div>
          <div>
            <h3 className="font-bold text-lg">{post.author}</h3>
            <p className="text-gray-600">{post.author_title}</p>
            <p className="text-sm text-gray-500 mt-1">{post.author_bio}</p>
          </div>
        </div>
      </header>
      
      {/* Featured Image */}
      <div className="mb-8 bg-[#fff8f8] rounded-xl h-[400px] flex items-center justify-center">
        {/* This would be an actual image in production */}
        <svg
          className="w-24 h-24 text-[rgba(255,77,79,0.3)]"
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
      <div className="prose prose-lg max-w-none mb-10">
        <div dangerouslySetInnerHTML={{ __html: post.content }} 
          className="blog-content [&_.warning-box]:bg-[#fff8f8] [&_.warning-box]:border-l-4 [&_.warning-box]:border-[rgb(255,77,79)] [&_.warning-box]:p-4 [&_.warning-box]:rounded [&_.warning-box]:mb-6 [&_.warning-box_h3]:text-[rgb(255,77,79)] [&_.warning-box_h3]:text-lg [&_.warning-box_h3]:font-bold [&_.warning-box_h3]:mt-0 [&_.warning-box_p]:mb-0"
        />
      </div>
      
      {/* Tags */}
      {post.tags && (
        <div className="mb-10">
          <h3 className="text-lg font-semibold mb-3">Related Topics</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
              <span 
                key={tag} 
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors rounded-full text-sm text-gray-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Social sharing */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gray-50 rounded-lg mb-10">
        <p className="font-medium mb-4 sm:mb-0">Share this article:</p>
        <div className="flex space-x-4">
          <button aria-label="Share on Facebook" className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow">
            <Facebook className="w-5 h-5 text-[#4267B2]" />
          </button>
          <button aria-label="Share on Twitter" className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow">
            <Twitter className="w-5 h-5 text-[#1DA1F2]" />
          </button>
          <button aria-label="Share on LinkedIn" className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow">
            <Linkedin className="w-5 h-5 text-[#0A66C2]" />
          </button>
          <button aria-label="Share by Email" className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow">
            <Mail className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      
      {/* Comments section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Discussion (6)</h3>
          <button className="bg-[rgb(255,77,79)] text-white px-4 py-2 rounded-lg hover:bg-[rgb(230,60,60)] transition-colors flex items-center">
            <MessageCircle className="w-4 h-4 mr-2" /> Add comment
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Sample comments - in a real app these would come from a database */}
          <div className="border-b pb-4">
            <div className="flex items-start mb-2">
              <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
              <div>
                <h4 className="font-bold">Jennifer K.</h4>
                <p className="text-gray-500 text-sm">4 hours ago</p>
              </div>
            </div>
            <p className="text-gray-700">My mother almost fell for this exact scam last month. They called claiming to be my brother needing bail money after a DUI. Thankfully she called me first to verify. These scammers are getting too good.</p>
            <div className="mt-2 flex items-center gap-4">
              <button className="text-gray-500 text-sm hover:text-[rgb(255,77,79)]">Reply</button>
              <button className="text-gray-500 text-sm hover:text-[rgb(255,77,79)]">Report</button>
            </div>
          </div>
          
          <div className="border-b pb-4">
            <div className="flex items-start mb-2">
              <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
              <div>
                <h4 className="font-bold">Michael T.</h4>
                <p className="text-gray-500 text-sm">Yesterday</p>
              </div>
            </div>
            <p className="text-gray-700">I work in cybersecurity and we're seeing these cases weekly now. Important advice in this article about creating verification protocols with family members. "Safe words" really do work.</p>
            <div className="mt-2 flex items-center gap-4">
              <button className="text-gray-500 text-sm hover:text-[rgb(255,77,79)]">Reply</button>
              <button className="text-gray-500 text-sm hover:text-[rgb(255,77,79)]">Report</button>
            </div>
          </div>
        </div>
        
        <button className="text-[rgb(255,77,79)] font-medium mt-4 hover:underline">View all 6 comments</button>
      </div>
      
      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-6">Related Articles</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {relatedPosts.map((relatedPost: any) => (
              <div key={relatedPost.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-40 bg-[#fff8f8] flex items-center justify-center">
                  {/* Placeholder for image */}
                  <svg
                    className="w-12 h-12 text-[rgba(255,77,79,0.3)]"
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
                <div className="p-4">
                  <span className="px-2 py-1 bg-[rgba(255,77,79,0.1)] text-[rgb(255,77,79)] text-xs font-medium rounded mb-2 inline-block">
                    {relatedPost.category}
                  </span>
                  <h4 className="font-bold mb-2 text-gray-900 line-clamp-2">{relatedPost.title}</h4>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{relatedPost.summary}</p>
                  <Link
                    href={`/blogs/${relatedPost.slug}`}
                    className="text-[rgb(255,77,79)] text-sm font-medium hover:underline"
                  >
                    Read article →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Call to action */}
      <div className="mt-12 border-t pt-12">
        <div className="text-center">
          <div className="inline-flex mb-4">
            <AlertTriangle className="w-10 h-10 text-[rgb(255,77,79)]" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Think you might be a victim?</h3>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Our free scam assessment tool can help you determine if you've been targeted and provide next steps for protecting yourself.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/guide"
              className="bg-[rgb(255,77,79)] text-white px-6 py-3 rounded-lg hover:bg-[rgb(230,60,60)] transition-colors font-medium"
            >
              Free Scam Assessment
            </Link>
            <Link
              href="/blogs"
              className="bg-white text-[rgb(255,77,79)] border border-[rgb(255,77,79)] px-6 py-3 rounded-lg hover:bg-[rgba(255,77,79,0.05)] transition-colors font-medium"
            >
              See More Articles
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
