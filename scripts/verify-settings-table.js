// Script to verify and repair the system_settings table
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

// Get credentials from env variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "Error: Missing Supabase URL or service role key in environment variables"
  );
  console.error(
    "Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set"
  );
  process.exit(1);
}

// Create Supabase client with service role for admin access
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Default settings
const defaultScoringWeights = {
  safeBrowsing: 25,
  domainAge: 20,
  ssl: 15,
  dns: 15,
  patternAnalysis: 15,
  baselineScore: 10,
};

const defaultRiskFactorPenalties = {
  manyRiskFactors: -30,
  severalRiskFactors: -15,
  privacyProtection: -5,
  whoisError: -5,
};

async function verifyAndRepairSettingsTable() {
  console.log("Starting verification of system_settings table...");

  try {
    // First check if the table exists by trying to select from it
    const { data: testData, error: testError } = await supabase
      .from("system_settings")
      .select("*")
      .limit(1);

    if (testError) {
      console.error(
        "Error accessing system_settings table:",
        testError.message
      );

      if (
        testError.message.includes('relation "system_settings" does not exist')
      ) {
        console.log("system_settings table does not exist. Creating it...");

        // Create the table
        const { error: createError } = await supabase.rpc(
          "create_system_settings_table"
        );

        if (createError) {
          console.error(
            "Failed to create system_settings table:",
            createError.message
          );
          return false;
        }

        console.log("system_settings table created successfully");
      } else {
        console.error("Unknown error accessing system_settings table");
        return false;
      }
    } else {
      console.log("system_settings table exists");
    }

    // Now check if the required settings exist
    const { data: scoringData } = await supabase
      .from("system_settings")
      .select("*")
      .eq("key", "scoring_weights")
      .single();

    if (!scoringData) {
      console.log("scoring_weights setting does not exist. Creating it...");
      const { error: insertScoreError } = await supabase
        .from("system_settings")
        .insert([{ key: "scoring_weights", value: defaultScoringWeights }]);

      if (insertScoreError) {
        console.error(
          "Failed to insert scoring_weights:",
          insertScoreError.message
        );
      } else {
        console.log("scoring_weights setting created successfully");
      }
    } else {
      console.log("scoring_weights setting exists:", scoringData);
    }

    // Check risk factor penalties
    const { data: riskData } = await supabase
      .from("system_settings")
      .select("*")
      .eq("key", "risk_factor_penalties")
      .single();

    if (!riskData) {
      console.log(
        "risk_factor_penalties setting does not exist. Creating it..."
      );
      const { error: insertRiskError } = await supabase
        .from("system_settings")
        .insert([
          { key: "risk_factor_penalties", value: defaultRiskFactorPenalties },
        ]);

      if (insertRiskError) {
        console.error(
          "Failed to insert risk_factor_penalties:",
          insertRiskError.message
        );
      } else {
        console.log("risk_factor_penalties setting created successfully");
      }
    } else {
      console.log("risk_factor_penalties setting exists:", riskData);
    }

    console.log("Verification and repair completed");
    return true;
  } catch (error) {
    console.error("Unexpected error during verification:", error);
    return false;
  }
}

// Run the verification
verifyAndRepairSettingsTable().then((result) => {
  if (result) {
    console.log("Settings table verification successful");
  } else {
    console.log("Settings table verification failed");
  }
  process.exit(result ? 0 : 1);
});
