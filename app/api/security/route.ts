import { NextRequest, NextResponse } from "next/server";

/**
 * Main security endpoint that serves as a unified entry point
 * This endpoint forwards requests to the appropriate domain-analysis endpoints
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain } = body;

    if (!domain) {
      return NextResponse.json(
        { error: "Domain is required" },
        { status: 400 }
      );
    }

    // Forward the request to the domain-analysis/analyze endpoint
    const response = await fetch(`${request.nextUrl.origin}/api/domain-analysis/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Domain analysis failed with status: ${response.status}`);
    }

    // Return the result directly
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("Security check error:", error);
    return NextResponse.json(
      { error: "Failed to perform security analysis" },
      { status: 500 }
    );
  }
}