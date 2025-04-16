import { NextRequest, NextResponse } from "next/server";

/**
 * Backward compatibility endpoint for existing client code
 * Redirects to the new domain-analysis/analyze endpoint
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward the request to the new endpoint
    const response = await fetch(
      `${request.nextUrl.origin}/api/domain-analysis/analyze`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error(`Domain analysis failed with status: ${response.status}`);
    }

    // Return the result directly
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Domain security check error:", error);
    return NextResponse.json(
      { error: "Failed to check domain security" },
      { status: 500 }
    );
  }
}
