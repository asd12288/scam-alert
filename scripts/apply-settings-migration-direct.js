// Script to directly apply SQL for the system_settings table migration
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
    console.log("⏳ Starting direct migration for system_settings table...");

    // Function to check if the system_settings table exists
    async function checkTableExists() {
      const { data, error } = await supabase
        .from("system_settings")
        .select("count(*)")
        .limit(1);

      if (
        error &&
        error.message.includes('relation "system_settings" does not exist')
      ) {
        return false;
      } else if (error) {
        console.error("Error checking if table exists:", error);
        return false;
      }

      return true;
    }

    // Check if table already exists
    const tableExists = await checkTableExists();
    if (tableExists) {
      console.log(
        "✅ system_settings table already exists. No migration needed."
      );
      return;
    }

    console.log("Creating system_settings table directly...");

    // Direct method: Use raw HTTP to send the SQL command
    // 1. Create the table
    await supabase.rpc("exec", {
      command: `
        CREATE TABLE IF NOT EXISTS system_settings (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          key VARCHAR NOT NULL UNIQUE,
          value JSONB NOT NULL,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `,
    });

    // 2. Insert the scoring_weights
    await supabase.from("system_settings").insert([
      {
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
      },
    ]);

    // 3. Insert the risk_factor_penalties
    await supabase.from("system_settings").insert([
      {
        key: "risk_factor_penalties",
        value: {
          manyRiskFactors: 8,
          severalRiskFactors: 4,
          privacyProtection: 2,
          whoisError: 3,
        },
        description:
          "Penalty values for various risk factors in security scoring",
      },
    ]);

    console.log("✅ Migration completed successfully!");
    console.log(
      "The system_settings table is now created with default configuration values."
    );

    // Verify the table was created
    const tableNowExists = await checkTableExists();
    if (tableNowExists) {
      console.log(
        "✅ Verification successful: system_settings table is accessible."
      );
    } else {
      console.warn(
        "⚠️ Verification failed: system_settings table is not accessible."
      );
      console.warn(
        "You may need to run the SQL migration manually in the Supabase SQL editor."
      );
    }
  } catch (error) {
    console.error("❌ Migration failed:", error);
    console.error(error.message);
    process.exit(1);
  }
}

applyMigration();
