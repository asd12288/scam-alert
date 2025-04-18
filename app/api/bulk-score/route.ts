import { NextRequest, NextResponse } from "next/server";

// Mock scoring function - replace with your actual implementation
// This would typically use your existing domain scoring logic
async function getDomainScore(domain: string): Promise<number> {
  // For demo purposes, we'll generate a random score based on domain name hash
  // In production, you would use your actual domain scoring logic
  // This ensures consistent scores for the same domain
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    hash = ((hash << 5) - hash) + domain.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  
  // Generate a score between 0 and 100
  // For demo purposes: domains with "scam" or "phish" will have low scores
  const baseScore = Math.abs(hash % 100);
  if (domain.includes('scam') || domain.includes('phish')) {
    return Math.min(35, baseScore);
  }
  
  // Well-known domains get higher scores
  if (
    domain.includes('google') || 
    domain.includes('microsoft') || 
    domain.includes('apple') || 
    domain.includes('amazon') || 
    domain.includes('github')
  ) {
    return Math.max(80, baseScore);
  }
  
  return baseScore;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hosts } = body as { hosts: string[] };

    if (!Array.isArray(hosts)) {
      return NextResponse.json({ error: "Invalid request: 'hosts' must be an array" }, { status: 400 });
    }

    // Rate limiting
    if (hosts.length > 200) {
      return NextResponse.json({ error: "Too many hosts. Maximum allowed: 200" }, { status: 429 });
    }

    // Process each domain and calculate scores
    const scores: Record<string, number> = {};

    await Promise.all(
      hosts.map(async (host) => {
        scores[host] = await getDomainScore(host);
      })
    );

    // Set CORS headers
    return NextResponse.json(scores, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "content-type",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Error in bulk-score API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    }
  });
}