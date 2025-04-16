// Script to apply the system_settings table migration
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
    console.log("⏳ Starting migration process for system_settings table...");

    // Read the migration SQL
    const migrationPath = path.resolve(
      process.cwd(),
      "migrations",
      "create_system_settings_table.sql"
    );
    const migrationSQL = fs.readFileSync(migrationPath, "utf8");

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

    // Split the SQL into separate statements
    const statements = migrationSQL
      .replace(/--.*$/gm, "") // Remove SQL comments
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    console.log(`📝 Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`🔄 Executing statement ${i + 1} of ${statements.length}...`);

      const { error } = await supabase.rpc("exec_sql", { sql: statement });

      if (error) {
        if (error.message.includes('function "exec_sql" does not exist')) {
          console.error(
            "❌ The exec_sql function does not exist in your database."
          );
          console.error(
            "Please create this function or run the SQL migration manually in the Supabase SQL editor:"
          );
          console.error("----------------");
          console.log(migrationSQL);
          console.error("----------------");
          process.exit(1);
        } else {
          console.error(`❌ Error executing statement ${i + 1}:`, error);
          process.exit(1);
        }
      }
    }

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
    process.exit(1);
  }
}

applyMigration();
