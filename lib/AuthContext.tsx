"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  supabase,
  getCurrentUser,
  getUserProfile,
  verifyAdminRole,
} from "./supabase";
import { User, Session } from "@supabase/supabase-js";
import type { UserProfile, UserRole } from "./services/authService";

type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  refreshAuth: () => Promise<void>;
  authInitialized: boolean; // Expose this to components
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  refreshAuth: async () => {},
  authInitialized: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Load user profile data with priority and caching
  const loadUserProfile = useCallback(async (userId: string) => {
    if (!userId) {
      setProfile(null);
      setIsAdmin(false);
      return;
    }

    try {
      console.log("[AuthContext] Loading profile for user:", userId);
      const userProfile = await getUserProfile(userId);

      // Directly check admin status and log it
      const adminStatus = userProfile?.role === "admin";
      console.log(
        `[AuthContext] Admin status determined: ${adminStatus} for user ${userId}`
      );

      setProfile(userProfile);
      setIsAdmin(adminStatus);

      console.log("[AuthContext] Profile loaded:", {
        hasProfile: !!userProfile,
        isAdmin: adminStatus,
        role: userProfile?.role,
        userId: userProfile?.id,
      });

      return { profile: userProfile, isAdmin: adminStatus };
    } catch (error) {
      console.error("[AuthContext] Error loading user profile:", error);
      setProfile(null);
      setIsAdmin(false);
      return null;
    }
  }, []);

  // This function can be called to force a refresh of auth state
  const refreshAuth = useCallback(async () => {
    console.log("[AuthContext] Manual refresh triggered");
    setLoading(true);

    try {
      const {
        data: { user: currentUser },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("[AuthContext] Error refreshing user:", error);
        setUser(null);
        setProfile(null);
        setIsAdmin(false);
        return;
      }

      console.log(
        "[AuthContext] Refresh - current user:",
        currentUser ? `found (${currentUser.email})` : "not found"
      );

      setUser(currentUser || null);

      if (currentUser) {
        await loadUserProfile(currentUser.id);
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("[AuthContext] Error refreshing auth:", error);
      setUser(null);
      setProfile(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, [loadUserProfile]);

  // First effect just to set mounted flag
  useEffect(() => {
    setMounted(true);
    return () => {
      // No cleanup needed for this effect
    };
  }, []);

  // Main auth effect that only runs after component is mounted
  useEffect(() => {
    // Skip this effect if not mounted yet
    if (!mounted) return;

    let isActive = true;
    console.log("[AuthContext] Initial auth check starting");

    // Set a longer timeout to ensure admin status is properly checked
    const timeoutId = setTimeout(() => {
      if (isActive && loading && !authInitialized) {
        console.log("[AuthContext] Auth check timed out after 5 seconds");
        setLoading(false);
        setAuthInitialized(true);
      }
    }, 5000); // Increased back to 5 seconds to give time for admin check

    // Check if there's a current session and user on initial load
    const initialAuthCheck = async () => {
      try {
        // Try to get current session first
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("[AuthContext] Session error:", sessionError);
          if (isActive) {
            setLoading(false);
            setAuthInitialized(true);
          }
          return;
        }

        // Then get the user
        const {
          data: { user: currentUser },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error("[AuthContext] User error:", userError);
          if (isActive) {
            setLoading(false);
            setAuthInitialized(true);
          }
          return;
        }

        // Only update state if component is still mounted
        if (isActive) {
          console.log("[AuthContext] Initial auth state:", {
            hasSession: !!session,
            hasUser: !!currentUser,
            email: currentUser?.email,
          });

          setUser(currentUser || null);

          if (currentUser) {
            // Wait for profile load to complete before marking auth as initialized
            const result = await loadUserProfile(currentUser.id);
            console.log(
              "[AuthContext] Profile load completed with result:",
              result
            );
            if (isActive) {
              setAuthInitialized(true);
              setLoading(false);
            }
          } else {
            setProfile(null);
            setIsAdmin(false);
            if (isActive) {
              setAuthInitialized(true);
              setLoading(false);
            }
          }
        }
      } catch (error) {
        console.error("[AuthContext] Error in initial auth check:", error);
        if (isActive) {
          setLoading(false);
          setAuthInitialized(true);
        }
      }
    };

    // Prioritize initialAuthCheck by calling it immediately
    initialAuthCheck();

    // Set up a listener for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("[AuthContext] Auth state change detected:", event, {
          hasSession: !!session,
          userId: session?.user?.id,
        });

        if (!isActive) return;

        // Handle auth events
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          const currentUser = session?.user || null;
          setUser(currentUser);

          if (currentUser) {
            await loadUserProfile(currentUser.id);
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setProfile(null);
          setIsAdmin(false);
        } else if (event === "USER_UPDATED") {
          setUser(session?.user || null);
          if (session?.user) {
            await loadUserProfile(session.user.id);
          }
        }

        setLoading(false);
      }
    );

    // Clean up the subscription
    return () => {
      isActive = false;
      clearTimeout(timeoutId);
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [mounted, loadUserProfile]); // Remove loading from dependencies to avoid re-running

  // During SSR, use a pre-rendered state that assumes not logged in
  // This avoids the flash of loading state on initial render
  if (!mounted) {
    return (
      <AuthContext.Provider
        value={{
          user: null,
          profile: null,
          loading: true,
          isAdmin: false,
          refreshAuth,
          authInitialized: false,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, isAdmin, refreshAuth, authInitialized }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Role-based access control hook
export const useRequireAuth = (requiredRole?: UserRole) => {
  const auth = useAuth();

  // Returns true if user is authenticated and meets role requirement (if specified)
  const authorized =
    !auth.loading &&
    !!auth.user &&
    (!requiredRole || (requiredRole === "admin" ? auth.isAdmin : true));

  return {
    ...auth,
    authorized,
  };
};
