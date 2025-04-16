// Direct script to create system_settings table and insert default values
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

// Create a Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Use the service key for elevated privileges
);

async function setupSystemSettings() {
  console.log("🔧 Setting up system_settings table...");

  try {
    // First check if the uuid-ossp extension is enabled
    console.log("Enabling uuid-ossp extension if not already enabled...");

    const { error: extensionError } = await supabase
      .rpc("extensions", {
        query: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`,
      })
      .single();

    if (extensionError) {
      console.log(
        "Note: Could not enable extension automatically. This may be fine if it's already enabled."
      );
      console.log(extensionError);
    }

    // 1. Create the system_settings table
    console.log("Creating system_settings table if it doesn't exist...");
    const { error: createTableError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS system_settings (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          key VARCHAR NOT NULL UNIQUE,
          value JSONB NOT NULL,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `,
    });

    if (createTableError) {
      console.log("Error creating table through RPC. Trying direct SQL...");

      // Alternative approach using the REST API for SQL
      const { error: sqlError } = await supabase.from("_sqlquery").select("*", {
        head: true,
        query: `
          CREATE TABLE IF NOT EXISTS system_settings (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            key VARCHAR NOT NULL UNIQUE,
            value JSONB NOT NULL,
            description TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      });

      if (sqlError) {
        console.error("Error creating table through SQL:", sqlError);
        return;
      }
    }

    // 2. Check if scoring_weights entry already exists
    console.log("Checking if scoring_weights entry exists...");
    const { data: existingWeights, error: weightCheckError } = await supabase
      .from("system_settings")
      .select("*")
      .eq("key", "scoring_weights")
      .maybeSingle();

    if (weightCheckError) {
      console.error("Error checking for scoring_weights:", weightCheckError);
    } else {
      // 3. Insert scoring_weights if not exists
      if (!existingWeights) {
        console.log("Inserting default scoring_weights...");
        const { error: insertWeightsError } = await supabase
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
            description:
              "Weights used in the domain security scoring algorithm",
          });

        if (insertWeightsError) {
          console.error("Error inserting scoring_weights:", insertWeightsError);
        }
      } else {
        console.log("scoring_weights entry already exists.");
      }
    }

    // 4. Check if risk_factor_penalties entry already exists
    console.log("Checking if risk_factor_penalties entry exists...");
    const { data: existingPenalties, error: penaltyCheckError } = await supabase
      .from("system_settings")
      .select("*")
      .eq("key", "risk_factor_penalties")
      .maybeSingle();

    if (penaltyCheckError) {
      console.error(
        "Error checking for risk_factor_penalties:",
        penaltyCheckError
      );
    } else {
      // 5. Insert risk_factor_penalties if not exists
      if (!existingPenalties) {
        console.log("Inserting default risk_factor_penalties...");
        const { error: insertPenaltiesError } = await supabase
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

        if (insertPenaltiesError) {
          console.error(
            "Error inserting risk_factor_penalties:",
            insertPenaltiesError
          );
        }
      } else {
        console.log("risk_factor_penalties entry already exists.");
      }
    }

    console.log(
      "✅ Setup completed. You may need to refresh your app to see the changes."
    );
  } catch (error) {
    console.error("Unexpected error during setup:", error);
  }
}

setupSystemSettings();
