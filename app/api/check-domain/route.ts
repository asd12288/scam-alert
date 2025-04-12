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

    // Ensure the domain has a protocol for the API request
    const url = domain.startsWith("http") ? domain : `https://${domain}`;

    // Google Safe Browsing API v4 endpoint
    const apiEndpoint =
      "https://safebrowsing.googleapis.com/v4/threatMatches:find";
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_SAFE_BROWSING_API_KEY;

    if (!apiKey) {
      console.error("Google Safe Browsing API key is not configured");
      return NextResponse.json(
        { error: "API configuration error" },
        { status: 500 }
      );
    }

    // Prepare the request body according to Google Safe Browsing API v4 documentation
    const requestBody = {
      client: {
        clientId: "domain-safety-checker",
        clientVersion: "1.0.0",
      },
      threatInfo: {
        threatTypes: [
          "MALWARE",
          "SOCIAL_ENGINEERING",
          "UNWANTED_SOFTWARE",
          "POTENTIALLY_HARMFUL_APPLICATION",
        ],
        platformTypes: ["ANY_PLATFORM"],
        threatEntryTypes: ["URL"],
        threatEntries: [{ url }],
      },
    };

    // Make the request to Google Safe Browsing API
    const response = await axios.post(
      `${apiEndpoint}?key=${apiKey}`,
      requestBody
    );

    // Process the response
    const matches = response.data.matches || [];
    const isMalicious = matches.length > 0;

    // Calculate a score based on whether the domain is malicious
    const score = isMalicious ? 20 : 95;

    // Return the result
    return NextResponse.json({
      score,
      details: {
        isMalicious,
        matches: matches.length > 0 ? matches : null,
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
