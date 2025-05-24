"use client";

import { supabase } from "@/lib/supabase";
import {
  AuthError,
  AuthResponse,
  Provider,
  Session,
  User,
  UserResponse,
} from "@supabase/supabase-js";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isMounted: boolean;
  error: Error | null;
  signUp: (
    email: string,
    password: string,
    options?: { name?: string }
  ) => Promise<AuthResponse>;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signInWithOAuth: (provider: Provider) => Promise<void>;
  signOut: () => Promise<void>;
  requestPasswordReset: (
    email: string
  ) => Promise<{ data: any; error: AuthError | null }>;
  resetPassword: (token: string, password: string) => Promise<UserResponse>;
  updateProfile: (data: {
    name?: string;
    avatar_url?: string;
  }) => Promise<{ data: User | null; error: Error | null }>;
  verifyEmail: (
    token: string
  ) => Promise<{ data: any; error: AuthError | null }>;
  clearAllSessions: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Set mounted state on client only
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only fetch session data when component has mounted on the client
  useEffect(() => {
    if (!isMounted) return;

    // Get initial session and set up listener
    const fetchSession = async () => {
      setIsLoading(true);

      try {
        // Get session
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user || null);

        // Listen for auth changes
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
          setUser(session?.user || null);
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error: any) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [isMounted]);

  const signUp = async (
    email: string,
    password: string,
    options?: { name?: string }
  ): Promise<AuthResponse> => {
    try {
      const response = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: options,
        },
      });

      return response;
    } catch (error: any) {
      setError(error);
      throw error;
    }
  };

  const signIn = async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    try {
      console.log(
        "[AuthProvider] Attempting to sign in with email and password"
      );
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (response.error) {
        console.error("[AuthProvider] Sign in error:", response.error.message);
      } else {
        console.log("[AuthProvider] Sign in successful, user authenticated");
      }

      return response;
    } catch (error: any) {
      console.error("[AuthProvider] Exception during sign in:", error.message);
      setError(error);
      throw error;
    }
  };

  const signInWithOAuth = async (provider: Provider): Promise<void> => {
    try {
      // Create an absolute URL for the callback
      const callbackUrl = new URL("/auth/callback", window.location.origin);

      // Get the redirect destination from query params or use dashboard as default
      const currentUrl = new URL(window.location.href);
      const next = currentUrl.searchParams.get("redirectUrl") || "/dashboard";

      // Add the next parameter to the callback URL
      callbackUrl.searchParams.set("next", next);

      console.log(
        `[AuthProvider] Starting OAuth flow with provider: ${provider}`
      );
      console.log(`[AuthProvider] Callback URL: ${callbackUrl.toString()}`);

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: callbackUrl.toString(),
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        console.error(`[AuthProvider] OAuth initiation error:`, error.message);
        throw error;
      }

      console.log(
        `[AuthProvider] OAuth flow started successfully for provider: ${provider}`
      );
    } catch (error: any) {
      console.error(`[AuthProvider] Error during ${provider} OAuth:`, error);
      setError(error);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
    } catch (error: any) {
      setError(error);
      throw error;
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      return await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
    } catch (error: any) {
      setError(error);
      throw error;
    }
  };

  const resetPassword = async (
    token: string,
    password: string
  ): Promise<UserResponse> => {
    try {
      return await supabase.auth.updateUser({
        password,
      });
    } catch (error: any) {
      setError(error);
      throw error;
    }
  };

  const updateProfile = async (data: {
    name?: string;
    avatar_url?: string;
  }) => {
    try {
      if (!user) throw new Error("No user logged in");

      const { data: userData, error } = await supabase.auth.updateUser({
        data,
      });

      if (userData.user) {
        setUser(userData.user);
      }

      return { data: userData.user, error };
    } catch (error: any) {
      setError(error);
      return { data: null, error };
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      // Verify email is handled automatically by Supabase when clicking the link
      // This is a placeholder function that would be used to verify the token
      // on the server side if needed
      return { data: {}, error: null };
    } catch (error: any) {
      setError(error);
      return { data: null, error };
    }
  };

  const clearAllSessions = async (): Promise<void> => {
    try {
      console.log("[AuthProvider] Clearing all sessions and auth data");

      // Sign out from Supabase (clears current session)
      await supabase.auth.signOut({ scope: "global" });

      // Clear localStorage items related to auth
      if (typeof window !== "undefined") {
        // Clear Supabase items
        const keysToRemove = [
          "supabase.auth.token",
          "supabase.auth.refreshToken",
          "supabase.auth.user",
          "supabase.auth.expires_at",
          "supabase.auth.expires_in",
          "sb-localhost-auth-token",
          "sb:token",
          "supabase-auth-token",
          "oauth_state",
        ];

        // Loop through potential keys and remove them
        keysToRemove.forEach((key) => {
          try {
            localStorage.removeItem(key);
          } catch (e) {
            console.error(
              `[AuthProvider] Failed to remove ${key} from localStorage`,
              e
            );
          }
        });

        // Try to clear any item with 'supabase' in the key
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes("supabase") || key.includes("sb:"))) {
            try {
              localStorage.removeItem(key);
            } catch (e) {
              console.log(
                `[AuthProvider] Failed to remove dynamic key ${key}`,
                e
              );
            }
          }
        }
      }

      // Clear the user and session state
      setUser(null);
      setSession(null);

      console.log("[AuthProvider] All sessions cleared successfully");
    } catch (error: any) {
      console.error("[AuthProvider] Error clearing sessions:", error);
      setError(error);
      throw error;
    }
  };

  const value = useMemo(
    () => ({
      user,
      session,
      isLoading,
      isMounted,
      error,
      signUp,
      signIn,
      signInWithOAuth,
      signOut,
      requestPasswordReset,
      resetPassword,
      updateProfile,
      verifyEmail,
      clearAllSessions,
    }),
    [user, session, isLoading, isMounted, error]
  );

  // Only render children when we're on the client
  // to prevent hydration mismatches
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
