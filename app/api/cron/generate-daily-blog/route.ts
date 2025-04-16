import { NextRequest, NextResponse } from "next/server";

// Set this to force dynamic behavior instead of static generation
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Extract API key from authorization header for security
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid API key" },
        { status: 401 }
      );
    }
    
    const providedKey = authHeader.substring(7); // Remove "Bearer " prefix
    const validKey = process.env.CRON_SECRET_KEY;
    
    // Verify the API key
    if (!validKey || providedKey !== validKey) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      );
    }
    
    // Check if we should auto-publish based on configuration
    const autoPublishSetting = process.env.AUTO_PUBLISH_BLOGS === "true";
    
    // Call the blog generation API
    console.log("[Cron] Triggering daily blog generation");
    const response = await fetch(
      new URL("/api/admin/generate-blog", request.url).toString(),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Pass the service role key to bypass normal auth
          "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          autoPublish: autoPublishSetting,
        }),
      }
    );

    const result = await response.json();
    
    if (!response.ok) {
      console.error("[Cron] Blog generation failed:", result);
      return NextResponse.json(
        { error: "Failed to generate daily blog", details: result },
        { status: 500 }
      );
    }
    
    console.log("[Cron] Successfully generated daily blog:", result.data?.title);
    
    return NextResponse.json({
      success: true,
      message: "Daily blog generated successfully",
      blogId: result.data?.id,
      blogTitle: result.data?.title,
      published: result.data?.published,
    });
  } catch (error) {
    console.error("[Cron] Error generating daily blog:", error);
    return NextResponse.json(
      { error: "Failed to generate daily blog" },
      { status: 500 }
    );
  }
}