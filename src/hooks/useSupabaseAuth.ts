import { supabase } from "@/lib/supabase";
import { Provider } from "@supabase/supabase-js";
import { useState } from "react";

export function useSupabaseAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset error state
  const clearError = () => setError(null);

  // Sign up with email and password
  const signUp = async (email: string, password: string, metadata?: object) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });

      if (error) {
        setError(error.message);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.message || "An error occurred during sign up";
      setError(errorMessage);
      return { success: false, error: { message: errorMessage } };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.message || "An error occurred during sign in";
      setError(errorMessage);
      return { success: false, error: { message: errorMessage } };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with OAuth provider
  const signInWithOAuth = async (provider: Provider) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });

      if (error) {
        setError(error.message);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (err: any) {
      const errorMessage =
        err.message || "An error occurred during OAuth sign in";
      setError(errorMessage);
      return { success: false, error: { message: errorMessage } };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        setError(error.message);
        return { success: false, error };
      }

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || "An error occurred during sign out";
      setError(errorMessage);
      return { success: false, error: { message: errorMessage } };
    } finally {
      setIsLoading(false);
    }
  };

  // Request password reset
  const requestPasswordReset = async (email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        setError(error.message);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (err: any) {
      const errorMessage =
        err.message || "An error occurred during password reset request";
      setError(errorMessage);
      return { success: false, error: { message: errorMessage } };
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (newPassword: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setError(error.message);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (err: any) {
      const errorMessage =
        err.message || "An error occurred during password reset";
      setError(errorMessage);
      return { success: false, error: { message: errorMessage } };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    clearError,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    requestPasswordReset,
    resetPassword,
  };
}
