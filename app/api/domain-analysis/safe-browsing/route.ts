import { NextRequest, NextResponse } from "next/server";
import { checkSafeBrowsing } from "@/lib/services/safeBrowsingService";

export async function POST(request: NextRequest) {
  try {
    const { domain } = await request.json();

    if (!domain) {
      return NextResponse.json(
        { error: "Domain is required" },
        { status: 400 }
      );
    }

    const cleanDomain = domain.trim().toLowerCase();

    // Check the domain against Google Safe Browsing API
    const safeBrowsingResult = await checkSafeBrowsing(cleanDomain).catch(
      (error) => {
        console.error("Safe Browsing API error:", error);
        return {
          isMalicious: false,
          error: true,
          message: "Failed to check Safe Browsing API",
        };
      }
    );

    // Calculate a simple score based on Safe Browsing result only
    const score = safeBrowsingResult.isMalicious ? 20 : 95;

    // Return the result
    return NextResponse.json({
      domain: cleanDomain,
      score,
      details: {
        isMalicious: safeBrowsingResult.isMalicious,
        matches: safeBrowsingResult.matches || null,
        error: safeBrowsingResult.error || false,
      },
    });
  } catch (error) {
    console.error("Domain safety check error:", error);

    return NextResponse.json(
      {
        error: "Failed to check domain safety",
        score: 50, // Default score when error
        details: {
          isMalicious: false,
          error: true,
        },
      },
      { status: 500 }
    );
  }
}
