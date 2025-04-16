// Simple script to create system_settings table and insert default data
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

async function applyMigration() {
  try {
    console.log("⏳ Starting migration for system_settings table...");

    // Try to fetch from the table to see if it exists
    const { error: testError } = await supabase
      .from("system_settings")
      .select("key")
      .limit(1);

    const tableExists =
      !testError || !testError.message.includes("does not exist");

    if (tableExists) {
      console.log(
        "✅ system_settings table already exists. No migration needed."
      );
      return;
    }

    console.log("🔧 Creating system_settings table...");

    // Using custom SQL function - make sure it exists in your Supabase instance
    const { error: createTableError } = await supabase.rpc("run_sql", {
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
      if (
        createTableError.message.includes('function "run_sql" does not exist')
      ) {
        console.error(
          "❌ The run_sql function does not exist in your database."
        );
        console.error(
          "Please create this function or run the SQL migration manually in the Supabase SQL editor."
        );
        process.exit(1);
      }

      throw createTableError;
    }

    console.log("📊 Inserting default settings data...");

    // Create default data using direct insert statements
    const { error: scoringError } = await supabase
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

    if (scoringError) {
      console.error("❌ Error inserting scoring weights:", scoringError);
      throw scoringError;
    }

    const { error: riskError } = await supabase.from("system_settings").insert({
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

    if (riskError) {
      console.error("❌ Error inserting risk penalties:", riskError);
      throw riskError;
    }

    console.log("✅ Migration completed successfully!");
    console.log(
      "The system_settings table is now created with default configuration values."
    );
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    console.error(
      "Please run the SQL migration manually in the Supabase SQL editor."
    );
    process.exit(1);
  }
}

applyMigration();
