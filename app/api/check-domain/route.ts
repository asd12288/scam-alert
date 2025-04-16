import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const { domain } = await request.json();

    if (!domain) {
      return NextResponse.json(
        { error: "Domain is required" },
        { status: 400 }
      );
    }

    // Forward the request to the main domain analysis endpoint
    // This ensures consistent scoring across all API routes
    const response = await fetch(
      `${request.nextUrl.origin}/api/domain-analysis/analyze`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      }
    );

    if (!response.ok) {
      throw new Error(`Domain analysis failed with status: ${response.status}`);
    }

    const analysisData = await response.json();

    return NextResponse.json({
      score: analysisData.score,
      details: {
        isMalicious: analysisData.details?.safeBrowsing?.isMalicious || false,
        matches: analysisData.details?.safeBrowsing?.matches || null,
        // Include additional details for better client-side feedback
        domainAge: analysisData.details?.whois?.data?.domainAge,
        ssl: analysisData.details?.ssl?.valid || false,
        dnsScore: analysisData.details?.dns?.securityScore || 0,
      },
    });
  } catch (error) {
    console.error("Error checking domain safety:", error);

    return NextResponse.json(
      {
        error: "Failed to check domain safety",
        score: 50,
        details: {
          isMalicious: false,
          error: true,
        },
      },
      { status: 500 }
    );
  }
}
