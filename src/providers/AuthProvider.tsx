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
import { supabase } from '@/lib/supabase';
import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react';

// Check if we're using NextAuth (environment variable can control this)
const USE_NEXTAUTH = true;

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
  
  // If using NextAuth, we'll use the session from NextAuth
  const nextAuthSession = USE_NEXTAUTH ? useSession() : null;

  useEffect(() => {
    // If we're using NextAuth, we don't need to fetch the Supabase session
    if (USE_NEXTAUTH) {
      setIsLoading(nextAuthSession?.status === 'loading');
      return;
    }
    
    // Get initial session and set up listener for Supabase
    const fetchSession = async () => {
      setIsLoading(true);
      
      try {
        // Get session
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user || null);
        
        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (_event, session) => {
            setSession(session);
            setUser(session?.user || null);
          }
        );
        
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
  }, [nextAuthSession?.status]);

  const signUp = async (
    email: string,
    password: string,
    options?: { name?: string }
  ): Promise<AuthResponse> => {
    if (USE_NEXTAUTH) {
      throw new Error('SignUp not implemented with NextAuth');
    }
    
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
    if (USE_NEXTAUTH) {
      try {
        const result = await nextAuthSignIn('credentials', {
          redirect: false,
          email,
          password,
        });
        
        // Create a compatible response for the interface
        if (result?.error) {
          const authError = new Error(result.error) as any;
          authError.status = 400;
          authError.code = 'invalid_credentials';
          authError.__isAuthError = true;
          authError.severity = 'warning';
          authError.name = 'AuthApiError';
          
          return {
            data: { session: null, user: null },
            error: authError as AuthError,
          };
        }
        
        return {
          data: { session: null, user: null },
          error: null,
        };
      } catch (error: any) {
        setError(error);
        throw error;
      }
    }
    
    try {
      console.log('[AuthProvider] Attempting to sign in with email and password');
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (response.error) {
        console.error('[AuthProvider] Sign in error:', response.error.message);
      } else {
        console.log('[AuthProvider] Sign in successful, user authenticated');
      }
      
      return response;
    } catch (error: any) {
      console.error('[AuthProvider] Exception during sign in:', error.message);
      setError(error);
      throw error;
    }
  };

  const signInWithOAuth = async (provider: Provider): Promise<void> => {
    if (USE_NEXTAUTH) {
      try {
        await nextAuthSignIn(provider as string, { callbackUrl: '/dashboard' });
        return;
      } catch (error: any) {
        setError(error);
        throw error;
      }
    }
    
    try {
      // Create an absolute URL for the callback
      const callbackUrl = new URL('/auth/callback', window.location.origin);
      
      // Get the redirect destination from query params or use dashboard as default
      const currentUrl = new URL(window.location.href);
      const next = currentUrl.searchParams.get('redirectUrl') || '/dashboard';
      
      // Add the next parameter to the callback URL
      callbackUrl.searchParams.set('next', next);
      
      console.log(`[AuthProvider] Starting OAuth flow with provider: ${provider}`);
      console.log(`[AuthProvider] Callback URL: ${callbackUrl.toString()}`);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: callbackUrl.toString(),
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) {
        console.error(`[AuthProvider] OAuth initiation error:`, error.message);
        throw error;
      }
      
      console.log(`[AuthProvider] OAuth flow started successfully for provider: ${provider}`);
    } catch (error: any) {
      console.error(`[AuthProvider] Error during ${provider} OAuth:`, error);
      setError(error);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    if (USE_NEXTAUTH) {
      try {
        await nextAuthSignOut({ redirect: false });
        return;
      } catch (error: any) {
        setError(error);
        throw error;
      }
    }
    
    try {
      await supabase.auth.signOut();
    } catch (error: any) {
      setError(error);
      throw error;
    }
  };

  const requestPasswordReset = async (email: string) => {
    if (USE_NEXTAUTH) {
      throw new Error('Password reset not implemented with NextAuth');
    }
    
    try {
      return await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
    } catch (error: any) {
      setError(error);
      throw error;
    }
  };

  const resetPassword = async (token: string, password: string): Promise<UserResponse> => {
    if (USE_NEXTAUTH) {
      throw new Error('Password reset not implemented with NextAuth');
    }
    
    try {
      return await supabase.auth.updateUser({
        password,
      });
    } catch (error: any) {
      setError(error);
      throw error;
    }
  };

  const updateProfile = async (data: { name?: string; avatar_url?: string }) => {
    if (USE_NEXTAUTH) {
      throw new Error('Profile update not implemented with NextAuth');
    }
    
    try {
      if (!user) throw new Error('No user logged in');
      
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
    if (USE_NEXTAUTH) {
      throw new Error('Email verification not implemented with NextAuth');
    }
    
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
    if (USE_NEXTAUTH) {
      try {
        await nextAuthSignOut();
        return;
      } catch (error: any) {
        setError(error);
        throw error;
      }
    }
    
    try {
      console.log('[AuthProvider] Clearing all sessions and auth data');
      
      // Sign out from Supabase (clears current session)
      await supabase.auth.signOut({ scope: 'global' });
      
      // Clear localStorage items related to auth
      if (typeof window !== 'undefined') {
        // Clear Supabase items
        const keysToRemove = [
          'supabase.auth.token',
          'supabase.auth.refreshToken',
          'supabase.auth.user',
          'supabase.auth.expires_at',
          'supabase.auth.expires_in',
          'sb-localhost-auth-token',
          'sb:token',
          'supabase-auth-token',
          'oauth_state'
        ];
        
        for (const key of keysToRemove) {
          localStorage.removeItem(key);
        }
      }
      
      // Update state
      setUser(null);
      setSession(null);
      
      console.log('[AuthProvider] All sessions cleared successfully');
    } catch (error: any) {
      console.error('[AuthProvider] Error clearing sessions:', error);
      setError(error);
      throw error;
    }
  };

  // If using NextAuth, we'll return a simplified context
  const nextAuthValue = useMemo(() => {
    // Always return a valid context, never null
    const contextValue: AuthContextType = {
      user: nextAuthSession?.data?.user ? { id: nextAuthSession.data.user.id, email: nextAuthSession.data.user.email } as User : null,
      session: null, // NextAuth session is not compatible with Supabase Session
      isLoading: nextAuthSession?.status === 'loading',
      error: null,
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
    
    return contextValue;
  }, [nextAuthSession]);

  // Create context value for Supabase auth
  const supabaseValue = useMemo(
    () => ({
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
    }),
    [user, session, isLoading, error]
  );

  return (
    <AuthContext.Provider value={USE_NEXTAUTH ? nextAuthValue : supabaseValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 