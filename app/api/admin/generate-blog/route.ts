import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { cookies } from "next/headers";
import OpenAI from "openai";
import { createBlogPost } from "@/lib/services/blogService";
import { slugify } from "@/lib/utils";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY_PERSONAL,
});

export const dynamic = "force-dynamic";

// Topics for blog generation (for variety)
const BLOG_TOPICS = [
  "phishing attacks",
  "romance scams",
  "investment fraud",
  "cryptocurrency scams",
  "tech support scams",
  "social media scams",
  "identity theft prevention",
  "online shopping fraud",
  "job scams",
  "lottery and sweepstakes scams",
  "email security tips",
  "password security",
  "two-factor authentication",
  "social engineering tactics",
  "deepfake scams",
  "AI-generated fraud",
];

// POST handler for generating a blog post
export async function POST(request: NextRequest) {
  try {
    // Get authorization header if present (for direct API calls)
    const authHeader = request.headers.get("authorization");
    // Check if we're in development mode
    const isDevelopment = process.env.NODE_ENV === "development" || 
                          process.env.NEXT_PUBLIC_IS_DEVELOPMENT === "true";
    
    // Parse request body to get topic preference or use random
    const body = await request.json().catch(() => ({}));
    
    // Skip authentication in development mode or if using service role key
    let skipAuthCheck = isDevelopment;
    
    // Check for service role key in authorization header
    if (authHeader && authHeader.startsWith("Bearer ") && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const token = authHeader.substring(7); // Remove "Bearer " prefix
      if (token === process.env.SUPABASE_SERVICE_ROLE_KEY) {
        skipAuthCheck = true;
      }
    }
    
    // Verify authorization if not skipping auth check
    if (!skipAuthCheck) {
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return NextResponse.json(
          { 
            error: "Authentication required",
            details: "You must be logged in to generate blog posts. In development mode, you can add NEXT_PUBLIC_IS_DEVELOPMENT=true to your .env.local file to bypass authentication."
          },
          { status: 401 }
        );
      }

      // Retrieve user role to check if admin
      const { data: userInfo } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (!userInfo || userInfo.role !== "admin") {
        return NextResponse.json(
          { error: "Admin privileges required" },
          { status: 403 }
        );
      }
    }
    
    // Default to published=false to allow review before publishing
    const defaultToPublished = body.autoPublish === true;
    const forceTopic = body.topic;
    
    // Select a random topic or use the provided one
    const topic = forceTopic || 
      BLOG_TOPICS[Math.floor(Math.random() * BLOG_TOPICS.length)];
    
    console.log(`[BlogGenerator] Generating blog about: ${topic}`);

    // Generate blog content using OpenAI
    const blogContent = await generateBlogContent(topic);
    
    if (!blogContent) {
      return NextResponse.json(
        { error: "Failed to generate blog content" },
        { status: 500 }
      );
    }
    
    // Create a slug from the title
    const slug = slugify(blogContent.title);
    
    // Insert the blog post into the database
    const { data, error } = await createBlogPost({
      title: blogContent.title,
      slug,
      excerpt: blogContent.excerpt,
      content: blogContent.content,
      published: defaultToPublished, // Default to draft for manual review
      author: "AI Scam Alert Team",
      tags: blogContent.tags,
    });
    
    if (error) {
      return NextResponse.json(
        { error: `Failed to save blog post: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Blog post generated successfully",
      data: {
        id: data?.[0]?.id,
        title: blogContent.title,
        slug,
        published: defaultToPublished,
      }
    });
  } catch (error) {
    console.error("[BlogGenerator] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate blog post" },
      { status: 500 }
    );
  }
}

// Function to generate blog content using OpenAI
async function generateBlogContent(topic: string): Promise<{
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
} | null> {
  try {
    // Create a prompt for the blog generation
    const prompt = `
      Create an informative and engaging blog post about ${topic} and online safety.
      Focus on educating readers about the dangers, how to identify these scams, and providing actionable prevention steps.
      
      The blog should include:
      1. A catchy title
      2. A brief 1-2 sentence excerpt/summary
      3. Well-structured HTML content with h2 headings, paragraphs, lists, and emphasis on key points
      4. Relevant examples that are up to date for ${new Date().getFullYear()}
      5. Actionable advice for readers
      
      Make sure the content is factual, helpful, and conversational in tone. 
      Don't include any placeholders or notes - just the final blog content.

      Return the response as JSON in the following format:
      {
        "title": "The blog title",
        "excerpt": "A brief compelling summary of the post",
        "content": "The full blog post content in HTML format",
        "tags": ["tag1", "tag2", "tag3"] // 3-5 relevant tags
      }
    `;

    // Generate the blog content using OpenAI
    const response = await openai.chat.completions.create({
      model: process.env.LLM_MODEL || "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a cybersecurity expert who specializes in educating the public about online scams and fraud. Write with authority but in an accessible style that general readers can understand."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    // Parse the response 
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content generated");
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("[BlogGenerator] Error generating content:", error);
    return null;
  }
}