import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

// GET handler for retrieving all users (admin only)
export async function GET(request: NextRequest) {
  try {
    // Get authorization header if present (for direct API calls)
    const authHeader = request.headers.get("authorization");
    // Check if we're in development mode
    const isDevelopment = process.env.NODE_ENV === "development" || 
                          process.env.NEXT_PUBLIC_IS_DEVELOPMENT === "true";
    
    // Skip authentication in development mode or if using service role key
    let skipAuthCheck = isDevelopment;
    
    // Check for service role key in authorization header
    if (authHeader && authHeader.startsWith("Bearer ") && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const token = authHeader.substring(7); // Remove "Bearer " prefix
      if (token === process.env.SUPABASE_SERVICE_ROLE_KEY) {
        skipAuthCheck = true;
      }
    }

    const cookieStore = cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Create a standard client for authentication check
    const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    });
    
    // Verify authorization if not skipping auth check
    if (!skipAuthCheck) {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return NextResponse.json(
          { 
            error: "Authentication required",
            details: "You must be logged in as an admin. In development mode, add NEXT_PUBLIC_IS_DEVELOPMENT=true to your .env.local file to bypass authentication."
          },
          { status: 401 }
        );
      }

      // Retrieve user role to check if admin
      const { data: userInfo } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (!userInfo || userInfo.role !== "admin") {
        return NextResponse.json(
          { error: "Admin privileges required" },
          { status: 403 }
        );
      }
    }

    // Create a direct Supabase client with service role key to bypass RLS
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
      return NextResponse.json(
        { error: "Server configuration error: missing service role key" },
        { status: 500 }
      );
    }

    // Create a service role client that can bypass RLS policies
    const adminClient = createClient(supabaseUrl!, serviceRoleKey);
    
    // Fetch all profiles
    const { data: profiles, error: profilesError } = await adminClient
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      return NextResponse.json(
        { error: "Failed to fetch user profiles" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      users: profiles || [],
    });
  } catch (error) {
    console.error("Error in users API:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

// PUT handler for updating user roles (admin only)
export async function PUT(request: NextRequest) {
  try {
    // Get authorization header if present (for direct API calls)
    const authHeader = request.headers.get("authorization");
    // Check if we're in development mode
    const isDevelopment = process.env.NODE_ENV === "development" || 
                          process.env.NEXT_PUBLIC_IS_DEVELOPMENT === "true";
    
    // Parse request body to get user role update info
    const body = await request.json();
    const { userId, role } = body;
    
    // Skip authentication in development mode or if using service role key
    let skipAuthCheck = isDevelopment;
    
    // Check for service role key in authorization header
    if (authHeader && authHeader.startsWith("Bearer ") && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const token = authHeader.substring(7); // Remove "Bearer " prefix
      if (token === process.env.SUPABASE_SERVICE_ROLE_KEY) {
        skipAuthCheck = true;
      }
    }

    const cookieStore = cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Create a standard client for authentication check
    const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    });
    
    // Verify authorization if not skipping auth check
    if (!skipAuthCheck) {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return NextResponse.json(
          { 
            error: "Authentication required",
            details: "You must be logged in as an admin. In development mode, add NEXT_PUBLIC_IS_DEVELOPMENT=true to your .env.local file to bypass authentication."
          },
          { status: 401 }
        );
      }

      // Retrieve user role to check if admin
      const { data: userInfo } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (!userInfo || userInfo.role !== "admin") {
        return NextResponse.json(
          { error: "Admin privileges required" },
          { status: 403 }
        );
      }
    }

    if (!userId || !role || !["admin", "user"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid request parameters" },
        { status: 400 }
      );
    }

    // Create a direct Supabase client with service role key to bypass RLS
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
      return NextResponse.json(
        { error: "Server configuration error: missing service role key" },
        { status: 500 }
      );
    }

    // Create a service role client that can bypass RLS policies
    const adminClient = createClient(supabaseUrl!, serviceRoleKey);
    
    const { error } = await adminClient
      .from("profiles")
      .update({ role })
      .eq("id", userId);

    if (error) {
      console.error("Error updating user role:", error);
      return NextResponse.json(
        { error: "Failed to update user role" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `User role updated to ${role}`,
    });
  } catch (error) {
    console.error("Error in update user role API:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}