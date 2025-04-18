import { NextRequest, NextResponse } from "next/server";
import {
  calculateSecurityScore,
  SecurityDetails,
} from "../domain-analysis/utils";

// Helper function to execute domain analysis with caching
async function analyzeDomain(domain: string, origin: string): Promise<number> {
  try {
    // Use the same endpoint that the web form uses (/api/domain-security)
    // to ensure consistent scoring between extension and web app
    const response = await fetch(`${origin}/api/domain-security`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain }),
    });

    if (!response.ok) {
      throw new Error(`Domain analysis failed with status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[bulk-score] Domain ${domain} scored: ${data.score}`);
    return data.score;
  } catch (error) {
    console.error(`Error analyzing domain ${domain}:`, error);
    return 50; // Default moderate score
  }
}

export async function POST(request: NextRequest) {
  try {
    const { hosts } = (await request.json()) as { hosts: string[] };

    if (!Array.isArray(hosts) || !hosts.length) {
      return NextResponse.json(
        { error: "Invalid hosts array" },
        { status: 400 }
      );
    }

    // Rate limiting
    if (hosts.length > 50) {
      return NextResponse.json(
        { error: "Too many hosts. Maximum allowed: 50" },
        { status: 429 }
      );
    }

    console.log(`[bulk-score] Processing ${hosts.length} hosts`);
    const origin = request.nextUrl.origin;

    // Process domains in smaller batches to avoid overwhelming the system
    const batchSize = 5;
    const scoreMap: Record<string, number> = {};

    // Process hosts in batches
    for (let i = 0; i < hosts.length; i += batchSize) {
      const batch = hosts.slice(i, i + batchSize);
      console.log(
        `[bulk-score] Processing batch ${i / batchSize + 1} with ${
          batch.length
        } hosts`
      );

      const batchPromises = batch.map(async (domain) => {
        const cleanDomain = domain.trim().toLowerCase();
        const score = await analyzeDomain(cleanDomain, origin);
        return [cleanDomain, score] as [string, number];
      });

      const results = await Promise.all(batchPromises);
      results.forEach(([domain, score]) => {
        scoreMap[domain] = score;
      });
    }

    // Set CORS headers for extension
    return NextResponse.json(scoreMap, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Bulk score API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}
