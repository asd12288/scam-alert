import { supabase } from "../supabase";

// Auth types
export type UserCredentials = {
  email: string;
  password: string;
};

export type SignUpCredentials = UserCredentials & {
  name?: string;
};

// User role type
export type UserRole = "admin" | "user";

// Extended user profile type
export type UserProfile = {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

// Auth helper functions
export async function signUp({ email, password, name }: SignUpCredentials) {
  console.log(
    `[AuthService] Signing up with email: ${email}, name provided: ${!!name}`
  );

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  console.log(`[AuthService] Sign up result:`, {
    success: !!data?.user,
    userId: data?.user?.id,
    error: error ? `${error.name}: ${error.message}` : null,
  });

  return { data, error };
}

export async function signIn({ email, password }: UserCredentials) {
  console.log(`[AuthService] Signing in with email: ${email}`);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log(`[AuthService] Sign in result:`, {
    success: !!data?.user,
    userId: data?.user?.id,
    sessionExists: !!data?.session,
    error: error ? `${error.name}: ${error.message}` : null,
  });

  return { data, error };
}

export async function signOut() {
  console.log(`[AuthService] Signing out`);

  const { error } = await supabase.auth.signOut();

  console.log(`[AuthService] Sign out result:`, {
    error: error ? `${error.name}: ${error.message}` : null,
  });

  return { error };
}

export async function getCurrentUser() {
  console.log(`[AuthService] Getting current user`);

  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error(`[AuthService] Error getting current user:`, error);
      return null;
    }

    console.log(`[AuthService] Current user result:`, {
      userExists: !!data?.user,
      userId: data?.user?.id,
      email: data?.user?.email,
    });

    return data?.user;
  } catch (error) {
    console.error("[AuthService] Exception in getCurrentUser:", error);
    return null;
  }
}

export async function resetPassword(email: string) {
  console.log(`[AuthService] Resetting password for email: ${email}`);

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/update-password`,
  });

  console.log(`[AuthService] Reset password result:`, {
    success: !error,
    error: error ? `${error.name}: ${error.message}` : null,
  });

  return { error };
}

// Get user profile including role
export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  console.log(`[AuthService] Getting user profile for userId: ${userId}`);

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("[AuthService] Error fetching user profile:", error);
      return null;
    }

    if (!data) {
      console.warn("[AuthService] No profile found for user ID:", userId);
      return null;
    }

    console.log(`[AuthService] User profile result:`, {
      profileExists: !!data,
      userId: data?.id,
      role: data?.role,
      email: data?.email,
      name: data?.name,
    });

    // Check if role is undefined or null, and set a default
    if (!data.role) {
      console.warn(
        `[AuthService] User ${userId} has no role defined, defaulting to "user"`
      );
      data.role = "user";
    }

    return data as UserProfile;
  } catch (error) {
    console.error("[AuthService] Exception in getUserProfile:", error);
    return null;
  }
}

// Check if the current user has admin role
export async function isCurrentUserAdmin(): Promise<boolean> {
  console.log(`[AuthService] Checking if current user is admin`);

  const user = await getCurrentUser();
  if (!user) {
    console.log(`[AuthService] No current user found, not admin`);
    return false;
  }

  const profile = await getUserProfile(user.id);
  const isAdmin = profile?.role === "admin";
  console.log(`[AuthService] Admin check result:`, { isAdmin });

  return isAdmin;
}

// Verify if a user exists and has an admin role
export async function verifyAdminRole(userId: string): Promise<boolean> {
  console.log(`[AuthService] Verifying admin role for userId: ${userId}`);

  try {
    // Get the raw data directly to see exactly what's stored
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("[AuthService] Error verifying admin role:", error);
      return false;
    }

    // Log the complete profile data for debugging
    console.log("[AuthService] Raw profile data:", data);

    // Explicitly check for admin role
    const isAdmin = data?.role === "admin";
    console.log(`[AuthService] Admin verification result: ${isAdmin}`);

    return isAdmin;
  } catch (error) {
    console.error("[AuthService] Exception in verifyAdminRole:", error);
    return false;
  }
}

// Update user role (admin only)
export async function updateUserRole(userId: string, role: UserRole) {
  console.log(
    `[AuthService] Updating user role: userId=${userId}, role=${role}`
  );

  const { data, error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);

  console.log(`[AuthService] Update user role result:`, {
    success: !error,
    error: error ? `${error.name}: ${error.message}` : null,
  });

  return { data, error };
}
