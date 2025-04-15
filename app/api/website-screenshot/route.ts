import { NextRequest, NextResponse } from "next/server";
import { captureScreenshot } from "@/lib/services/screenshotService";

export async function POST(request: NextRequest) {
  try {
    const { domain } = await request.json();

    if (!domain) {
      return NextResponse.json(
        { error: "Domain is required" },
        { status: 400 }
      );
    }

    // Use smaller dimensions for thumbnail screenshots
    const screenshot = await captureScreenshot(domain, {
      width: 1024,
      height: 768,
      quality: 70, // Lower quality for faster loading and smaller file size
      timeout: 8000,
      fullPage: false,
    });

    if (screenshot) {
      return NextResponse.json({
        success: true,
        screenshot: `data:image/jpeg;base64,${screenshot}`,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to capture screenshot",
          fallbackImage: "/screenshot-unavailable.png",
        },
        { status: 200 } // Still return 200 to handle gracefully on client
      );
    }
  } catch (error) {
    console.error("Screenshot capture error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process screenshot request",
        fallbackImage: "/screenshot-unavailable.png",
      },
      { status: 500 }
    );
  }
}
