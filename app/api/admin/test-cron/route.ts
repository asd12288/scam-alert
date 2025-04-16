import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Get authorization header if present (for direct API calls)
    const authHeader = request.headers.get("authorization");
    // Check if we're in development mode
    const isDevelopment =
      process.env.NODE_ENV === "development" ||
      process.env.NEXT_PUBLIC_IS_DEVELOPMENT === "true";

    // Skip authentication in development mode or if using service role key
    let skipAuthCheck = isDevelopment;

    // Check for service role key in authorization header
    if (
      authHeader &&
      authHeader.startsWith("Bearer ") &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      const token = authHeader.substring(7); // Remove "Bearer " prefix
      if (token === process.env.SUPABASE_SERVICE_ROLE_KEY) {
        skipAuthCheck = true;
      }
    }

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    // Verify authorization if not skipping auth check
    if (!skipAuthCheck) {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return NextResponse.json(
          {
            error: "Authentication required",
            details:
              "You must be logged in as an admin. In development mode, add NEXT_PUBLIC_IS_DEVELOPMENT=true to your .env.local file to bypass authentication.",
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

    // Verify that required environment variables are set
    const missingVars = [];
    if (!process.env.CRON_SECRET_KEY) missingVars.push("CRON_SECRET_KEY");
    if (!process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY_PERSONAL)
      missingVars.push("OPENAI_API_KEY");

    if (missingVars.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Missing required environment variables: ${missingVars.join(
          ", "
        )}`,
        requiredVars: missingVars,
      });
    }

    // All checks passed
    return NextResponse.json({
      success: true,
      message:
        "Cron setup verification passed! Your environment is properly configured.",
      autoPublishSetting:
        process.env.AUTO_PUBLISH_BLOGS === "true" ? "enabled" : "disabled",
    });
  } catch (error) {
    console.error("[AdminAPI] Error testing cron setup:", error);
    return NextResponse.json(
      { error: "Failed to test cron setup" },
      { status: 500 }
    );
  }
}
