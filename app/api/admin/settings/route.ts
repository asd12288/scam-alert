import { NextRequest, NextResponse } from "next/server";
import {
  getScoringWeights,
  updateScoringWeights,
  getRiskFactorPenalties,
  updateRiskFactorPenalties,
  getDefaultScoringWeights,
  getDefaultRiskFactorPenalties,
} from "@/lib/services/settingsService";
import { createClient } from "@/lib/supabase";
import { cookies } from "next/headers";

/**
 * GET handler for fetching settings
 */
export async function GET(request: NextRequest) {
  try {
    // Create server-side Supabase client with cookie access
    const cookieStore = cookies();
    const supabaseServer = createClient(cookieStore);

    // No authentication check - anyone can access settings

    // Try to fetch settings data
    let scoringWeights;
    let riskPenalties;

    try {
      // Attempt to get scoring weights
      scoringWeights = await getScoringWeights(supabaseServer);
    } catch (error) {
      console.error("[API] Error fetching scoring weights:", error);
      // Use defaults if table doesn't exist or other error
      scoringWeights = getDefaultScoringWeights();
    }

    try {
      // Attempt to get risk penalties
      riskPenalties = await getRiskFactorPenalties(supabaseServer);
    } catch (error) {
      console.error("[API] Error fetching risk penalties:", error);
      // Use defaults if table doesn't exist or other error
      riskPenalties = getDefaultRiskFactorPenalties();
    }

    // Return settings data
    return NextResponse.json({
      scoring_weights: scoringWeights,
      risk_penalties: riskPenalties,
    });
  } catch (error) {
    console.error("[API] Unhandled error in settings GET:", error);

    // Return default settings rather than an error
    return NextResponse.json({
      scoring_weights: getDefaultScoringWeights(),
      risk_penalties: getDefaultRiskFactorPenalties(),
      error_message: "Could not fetch settings from database, using defaults",
    });
  }
}

/**
 * POST handler for updating settings
 */
export async function POST(request: NextRequest) {
  try {
    // Create server-side Supabase client with cookie access
    const cookieStore = cookies();
    const supabaseServer = createClient(cookieStore);

    // No authentication check - anyone can update settings

    // Parse request body
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { error: "Missing required fields: type or data" },
        { status: 400 }
      );
    }

    // Check if table exists first
    let tableExists = true;
    try {
      const { error } = await supabaseServer
        .from("system_settings")
        .select("key", { count: "exact", head: true });

      if (
        error &&
        error.message.includes('relation "system_settings" does not exist')
      ) {
        tableExists = false;
      }
    } catch (error) {
      console.error("[API] Error checking if settings table exists:", error);
      tableExists = false;
    }

    // If table doesn't exist, create it with default values
    if (!tableExists) {
      console.warn(
        "[API] Settings table doesn't exist, returning error to client"
      );
      return NextResponse.json(
        {
          error: "Settings table does not exist. Please run migration first.",
          code: "SETTINGS_TABLE_MISSING",
        },
        { status: 500 }
      );
    }

    // Update appropriate settings using server client
    try {
      if (type === "scoring_weights") {
        await updateScoringWeights(data, supabaseServer);
        console.log("[API] Successfully updated scoring weights");
      } else if (type === "risk_penalties") {
        await updateRiskFactorPenalties(data, supabaseServer);
        console.log("[API] Successfully updated risk penalties");
      } else {
        return NextResponse.json(
          { error: "Invalid settings type" },
          { status: 400 }
        );
      }
    } catch (error: any) {
      console.error(`[API] Error updating ${type}:`, error);

      return NextResponse.json(
        {
          error: `Failed to update ${type}: ${
            error.message || "Unknown error"
          }`,
          code: error.code,
        },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: `${type} updated successfully`,
    });
  } catch (error: any) {
    console.error("[API] Unhandled error in settings POST:", error);
    return NextResponse.json(
      {
        error: "Failed to update settings.",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
