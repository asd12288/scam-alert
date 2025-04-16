// Script to insert default settings into an existing system_settings table
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Load environment variables from .env.local if it exists
try {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    envContent.split("\n").forEach((line) => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^['"]|['"]$/g, "");
        process.env[key] = value;
      }
    });
  }
} catch (error) {
  console.error("Error loading .env.local file:", error);
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "Supabase URL or key not found. Make sure you have the following in your .env.local:"
  );
  console.error("NEXT_PUBLIC_SUPABASE_URL=your_supabase_url");
  console.error("SUPABASE_SERVICE_ROLE_KEY=your_service_key_or_anon_key");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function insertDefaultSettings() {
  try {
    console.log("⏳ Checking if settings data exists...");

    // Check if the scoring_weights entry exists
    const { data: scoringWeightsData, error: scoringWeightsError } =
      await supabase
        .from("system_settings")
        .select("key")
        .eq("key", "scoring_weights")
        .maybeSingle();

    if (scoringWeightsError) {
      console.error(
        "❌ Error checking for scoring weights:",
        scoringWeightsError
      );
      throw scoringWeightsError;
    }

    // Check if the risk_factor_penalties entry exists
    const { data: riskFactorsData, error: riskFactorsError } = await supabase
      .from("system_settings")
      .select("key")
      .eq("key", "risk_factor_penalties")
      .maybeSingle();

    if (riskFactorsError) {
      console.error("❌ Error checking for risk factors:", riskFactorsError);
      throw riskFactorsError;
    }

    // Insert scoring weights if they don't exist
    if (!scoringWeightsData) {
      console.log("📊 Inserting scoring_weights data...");

      const { error: insertScoringError } = await supabase
        .from("system_settings")
        .insert({
          key: "scoring_weights",
          value: {
            safeBrowsing: 30,
            domainAge: 20,
            ssl: 15,
            dns: 15,
            patternAnalysis: 20,
            baselineScore: 70,
          },
          description: "Weights used in the domain security scoring algorithm",
        });

      if (insertScoringError) {
        console.error(
          "❌ Error inserting scoring weights:",
          insertScoringError
        );
        throw insertScoringError;
      }

      console.log("✅ Scoring weights inserted successfully");
    } else {
      console.log("✓ Scoring weights already exist, skipping");
    }

    // Insert risk factor penalties if they don't exist
    if (!riskFactorsData) {
      console.log("📊 Inserting risk_factor_penalties data...");

      const { error: insertRiskError } = await supabase
        .from("system_settings")
        .insert({
          key: "risk_factor_penalties",
          value: {
            manyRiskFactors: 8,
            severalRiskFactors: 4,
            privacyProtection: 2,
            whoisError: 3,
          },
          description:
            "Penalty values for various risk factors in security scoring",
        });

      if (insertRiskError) {
        console.error(
          "❌ Error inserting risk factor penalties:",
          insertRiskError
        );
        throw insertRiskError;
      }

      console.log("✅ Risk factor penalties inserted successfully");
    } else {
      console.log("✓ Risk factor penalties already exist, skipping");
    }

    console.log("✨ Settings data verification complete!");
  } catch (error) {
    console.error("❌ Failed to insert settings data:", error.message);
    process.exit(1);
  }
}

insertDefaultSettings();
