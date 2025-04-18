import { NextResponse } from "next/server";
import { fetchLatestBlogs } from "@/lib/services/blogService";

export async function GET() {
  // This would typically fetch from your database through blogService
  // For now, we'll use placeholder data
  const blogs = [
    {
      id: "1",
      title: "How to Identify Phishing Emails",
      slug: "how-to-identify-phishing-emails",
      excerpt:
        "Learn the key warning signs of phishing emails and how to protect yourself.",
      createdAt: "2025-04-10T10:00:00Z",
      updatedAt: "2025-04-10T10:00:00Z",
    },
    {
      id: "2",
      title: "Common Online Shopping Scams to Avoid",
      slug: "common-online-shopping-scams-to-avoid",
      excerpt:
        "Be aware of these tactics scammers use to trick shoppers online.",
      createdAt: "2025-04-05T14:30:00Z",
      updatedAt: "2025-04-05T14:30:00Z",
    },
    {
      id: "3",
      title: "Cryptocurrency Fraud: How to Protect Your Assets",
      slug: "cryptocurrency-fraud-protection",
      excerpt:
        "Safeguard your crypto investments with these essential security measures.",
      createdAt: "2025-04-01T09:15:00Z",
      updatedAt: "2025-04-01T09:15:00Z",
    },
  ];

  // Generate RSS feed XML
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://scam-protector.com";

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Scam Protector Blog</title>
    <link>${baseUrl}/blogs</link>
    <description>Latest articles on scam prevention, online security, and safe browsing practices</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${blogs
      .map(
        (post) => `
    <item>
      <title>${post.title}</title>
      <link>${baseUrl}/blogs/${post.slug}</link>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      <guid isPermaLink="true">${baseUrl}/blogs/${post.slug}</guid>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  // Return the XML with proper content type
  return new NextResponse(rssXml, {
    headers: {
      "Content-Type": "application/xml",
      // Cache for 1 hour
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
