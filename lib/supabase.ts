import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { type CookieOptions } from "@supabase/auth-helpers-shared";

// Properly handle environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const isDevelopment =
  process.env.NODE_ENV === "development" ||
  process.env.NEXT_PUBLIC_IS_DEVELOPMENT === "true";

// Determine if running in browser
const isBrowser = typeof window !== "undefined";
const isLocalhost =
  isBrowser &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

// Configure cookie options for authentication
const cookieOptions: CookieOptions = {
  name: "sb-auth",
  lifetime: 60 * 60 * 24 * 365, // 1 year
  domain: isLocalhost ? "localhost" : undefined,
  sameSite: "lax",
  path: "/",
  // Only use secure cookies in production or when not on localhost
  secure: !isLocalhost,
};

console.log("[Supabase] Initialization with:", {
  urlExists: !!supabaseUrl,
  keyExists: !!supabaseAnonKey,
  environment: isDevelopment ? "development" : "production",
  isLocalhost,
  cookieSecure: cookieOptions.secure,
  cookieSameSite: cookieOptions.sameSite,
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "[Supabase] Credentials are missing. Check your environment variables."
  );
}

// Client-side Supabase client
export const supabase = createSupabaseClient(
  supabaseUrl || "",
  supabaseAnonKey || "",
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      cookieOptions,
    },
  }
);

// Server-side Supabase client creator function
export function createClient(cookieStore?: any) {
  console.log(
    "[Supabase] Creating server client with cookieStore:",
    !!cookieStore
  );

  if (!cookieStore) {
    console.warn(
      "[Supabase] No cookie store provided to server client, using default"
    );
    return supabase;
  }

  return createSupabaseClient(supabaseUrl || "", supabaseAnonKey || "", {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      cookieOptions,
    },
    cookies: {
      get(name: string) {
        const cookie = cookieStore.get(name);
        console.log(
          `[Supabase] Server getting cookie: ${name}, exists: ${!!cookie?.value}`
        );
        return cookie?.value;
      },
      set(name: string, value: string, options: any) {
        // Ensure the secure option matches our environment
        if (isLocalhost) {
          options = { ...options, secure: false };
        }

        console.log(
          `[Supabase] Server setting cookie: ${name}, with options:`,
          { ...options, value: value ? "[FILTERED]" : null }
        );
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: any) {
        console.log(`[Supabase] Server removing cookie: ${name}`);
        cookieStore.delete({ name, ...options });
      },
    },
  });
}

// Re-export types from service files for backward compatibility
export * from "./services/authService";
export * from "./services/blogService";
export * from "./services/commentService";
