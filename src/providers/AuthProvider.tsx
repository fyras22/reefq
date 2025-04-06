'use client';

import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useMemo,
} from 'react';
import {
  AuthError,
  AuthResponse,
  Provider,
  Session,
  User,
  UserResponse,
} from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: Error | null;
  signUp: (
    email: string,
    password: string,
    options?: { name?: string }
  ) => Promise<AuthResponse>;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signInWithOAuth: (provider: Provider) => Promise<void>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ data: any; error: AuthError | null }>;
  resetPassword: (token: string, password: string) => Promise<UserResponse>;
  updateProfile: (data: { name?: string; avatar_url?: string }) => Promise<{ data: User | null; error: Error | null }>;
  verifyEmail: (token: string) => Promise<{ data: any; error: AuthError | null }>;
  clearAllSessions: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const fetchSessionAndSetupListener = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data: { session: initialSession }, error: initialError } = await supabase.auth.getSession();
        if (initialError) throw initialError;

        setSession(initialSession);
        setUser(initialSession?.user ?? null);

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (_event, currentSession) => {
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            setIsLoading(false);
            setError(null);
          }
        );

        if (!initialSession) {
             setIsLoading(false);
        }

        return () => {
          subscription?.unsubscribe();
        };
      } catch (error: any) {
        console.error("[AuthProvider] Error fetching session or setting listener:", error);
        setError(error);
        setIsLoading(false);
      }
    };

    fetchSessionAndSetupListener();
  }, []);

  const value = useMemo(() => {
    const supabase = createClient();

    const signUp = async (
      email: string,
      password: string,
      options?: { name?: string }
    ): Promise<AuthResponse> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: options,
          },
        });
        if (response.error) throw response.error;
        return response;
      } catch (error: any) {
        console.error("[AuthProvider] SignUp Error:", error);
        setError(error);
        return { data: { session: null, user: null }, error: error as AuthError };
      } finally {
        setIsLoading(false);
      }
    };

    const signIn = async (
      email: string,
      password: string
    ): Promise<AuthResponse> => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('[AuthProvider] Attempting to sign in with email and password');
        const response = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (response.error) {
          console.error('[AuthProvider] Sign in error:', response.error.message);
          throw response.error;
        } else {
          console.log('[AuthProvider] Sign in successful, user authenticated via listener');
        }
        return response;
      } catch (error: any) {
        console.error('[AuthProvider] Exception during sign in:', error.message);
        setError(error);
        return { data: { session: null, user: null }, error: error as AuthError };
      } finally {
        setIsLoading(false);
      }
    };

    const signInWithOAuth = async (provider: Provider): Promise<void> => {
      setIsLoading(true);
      setError(null);
      try {
        const callbackUrl = new URL('/auth/callback', window.location.origin);

        const currentUrl = new URL(window.location.href);
        const next = currentUrl.searchParams.get('redirectedFrom') || currentUrl.searchParams.get('next') || '/dashboard';

        callbackUrl.searchParams.set('next', next);

        console.log(`[AuthProvider] Starting OAuth flow with provider: ${provider}`);
        console.log(`[AuthProvider] Callback URL: ${callbackUrl.toString()}`);

        const { error: oauthError } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: callbackUrl.toString(),
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            },
          },
        });

        if (oauthError) {
          console.error(`[AuthProvider] OAuth initiation error:`, oauthError.message);
          throw oauthError;
        }

        console.log(`[AuthProvider] OAuth flow started successfully for provider: ${provider}`);
      } catch (error: any) {
        console.error(`[AuthProvider] Error during ${provider} OAuth:`, error);
        setError(error);
        setIsLoading(false);
      }
    };

    const signOut = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);
      try {
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) throw signOutError;
        console.log("[AuthProvider] Signed out successfully.");
      } catch (error: any) {
        console.error("[AuthProvider] SignOut Error:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    const requestPasswordReset = async (email: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        });
        if (resetError) throw resetError;
        return { data, error: null };
      } catch (error: any) {
        console.error("[AuthProvider] Request Password Reset Error:", error);
        setError(error);
        return { data: null, error: error as AuthError };
      } finally {
        setIsLoading(false);
      }
    };

    const resetPassword = async (password: string): Promise<UserResponse> => {
      setIsLoading(true);
      setError(null);
      try {
          const { data, error: updateError } = await supabase.auth.updateUser({ password });
          if (updateError) throw updateError;
          console.log("[AuthProvider] Password updated successfully.");
          return { data, error: null };
      } catch (error: any) {
          console.error("[AuthProvider] Reset Password Error (updateUser):", error);
          setError(error);
          return { data: { user: null }, error: error as AuthError };
      } finally {
          setIsLoading(false);
      }
    };

    const updateProfile = async (data: { name?: string; avatar_url?: string }) => {
      setIsLoading(true);
      setError(null);
      try {
          const updateData: { data?: { [key: string]: any } } = {};
          if (data.name) {
              if (!updateData.data) updateData.data = {};
              updateData.data.full_name = data.name;
          }
          if (data.avatar_url) {
              if (!updateData.data) updateData.data = {};
              updateData.data.avatar_url = data.avatar_url;
          }

          if (!updateData.data) {
              console.warn("[AuthProvider] No data provided for profile update.");
              return { data: user, error: null };
          }

          const { data: updatedUserResponse, error: updateError } = await supabase.auth.updateUser(updateData);

          if (updateError) throw updateError;

          setUser(updatedUserResponse.user);

          console.log("[AuthProvider] Profile updated successfully.");
          return { data: updatedUserResponse.user, error: null };
      } catch (error: any) {
          console.error("[AuthProvider] Update Profile Error:", error);
          setError(error);
          return { data: null, error: error as Error };
      } finally {
          setIsLoading(false);
      }
    };

    const verifyEmail = async () => {
      console.warn("[AuthProvider] verifyEmail function called - usually handled by Supabase link.");
      return { data: null, error: null };
    };

    const clearAllSessions = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);
      try {
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) throw signOutError;
        console.log("[AuthProvider] Cleared current session (simulating clearAllSessions).");
      } catch (error: any) {
        console.error("[AuthProvider] Clear All Sessions (SignOut) Error:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    return {
      user,
      session,
      isLoading,
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
    };
  }, [user, session, isLoading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 