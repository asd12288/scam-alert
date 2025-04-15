"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  supabase,
  getCurrentUser,
  getUserProfile,
  UserRole,
  UserProfile,
} from "./supabase";
import { User } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const loadUserProfile = async (userId: string) => {
    if (!userId) {
      setProfile(null);
      setIsAdmin(false);
      return;
    }

    try {
      const userProfile = await getUserProfile(userId);
      setProfile(userProfile);
      setIsAdmin(userProfile?.role === "admin");
    } catch (error) {
      console.error("Error loading user profile:", error);
      setProfile(null);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    // Check if there's a current user on initial load
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setUser(user || null);

        if (user) {
          await loadUserProfile(user.id);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Set up a listener for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);

        if (currentUser) {
          await loadUserProfile(currentUser.id);
        } else {
          setProfile(null);
          setIsAdmin(false);
        }

        setLoading(false);
      }
    );

    // Clean up the subscription
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin }}>
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
