'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function SetLoginFlag() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirectTo') || '/dashboard';
  const hash = searchParams?.get('hash') || window.location.hash;
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function processAuthentication() {
      try {
        console.log('[SetLoginFlag] Starting authentication process');
        
        // Check if we have a hash, either from the URL or from the query parameter
        if (hash && hash.includes('access_token')) {
          console.log('[SetLoginFlag] Processing hash with access_token');
          
          // Extract tokens from hash
          const accessToken = extractFromHash(hash, 'access_token');
          const refreshToken = extractFromHash(hash, 'refresh_token');
          
          if (accessToken) {
            // Check if we already have a session
            const { data: sessionData } = await supabase.auth.getSession();
            
            // If we don't have a session, set it manually
            if (!sessionData.session) {
              console.log('[SetLoginFlag] No session found, setting session manually');
              
              if (refreshToken) {
                // Set session with refresh token
                const { data, error: sessionError } = await supabase.auth.setSession({
                  access_token: accessToken,
                  refresh_token: refreshToken
                });
                
                if (sessionError) {
                  console.error('[SetLoginFlag] Error setting session:', sessionError.message);
                  setError('Failed to establish session. Please try signing in again.');
                  setIsProcessing(false);
                  return;
                }
                
                console.log('[SetLoginFlag] Session established manually:', !!data.session);
              } else {
                // Just try to set the access token
                console.log('[SetLoginFlag] No refresh token, trying to use access token only');
                
                // This is less reliable but might work
                const { data, error: sessionError } = await supabase.auth.getUser(accessToken);
                
                if (sessionError || !data.user) {
                  console.error('[SetLoginFlag] Error getting user with token:', sessionError?.message);
                  setError('Failed to authenticate. Please try signing in again.');
                  setIsProcessing(false);
                  return;
                }
              }
            } else {
              console.log('[SetLoginFlag] Session already established');
            }
          } else {
            console.error('[SetLoginFlag] Could not extract access token from hash');
            setError('Authentication incomplete. Please try signing in again.');
            setIsProcessing(false);
            return;
          }
        } else {
          // No hash, check if we have a session anyway (for the code flow)
          const { data } = await supabase.auth.getSession();
          if (!data.session) {
            console.error('[SetLoginFlag] No session or hash found');
            setError('No authentication data found. Please try signing in again.');
            setIsProcessing(false);
            return;
          }
          console.log('[SetLoginFlag] Session found without hash (code flow)');
        }
        
        // Wait a moment to ensure session is fully established
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Double-check that we have a session before redirecting
        const { data: finalCheck } = await supabase.auth.getSession();
        if (!finalCheck.session) {
          console.error('[SetLoginFlag] Final session check failed');
          setError('Session could not be established. Please try signing in again.');
          setIsProcessing(false);
          return;
        }
        
        // Set the flag in sessionStorage to show the welcome message
        console.log('[SetLoginFlag] Setting justLoggedIn flag in sessionStorage');
        sessionStorage.setItem('justLoggedIn', 'true');
        
        // Redirect to the final destination using a hard navigation
        // This ensures a clean state and proper session loading
        console.log('[SetLoginFlag] Authentication successful, redirecting to:', redirectTo);
        window.location.href = redirectTo;
      } catch (err: any) {
        console.error('[SetLoginFlag] Error processing authentication:', err);
        setError('Authentication error. Please try again.');
        setIsProcessing(false);
      }
    }
    
    processAuthentication();
  }, [hash, redirectTo]);

  // Helper function to extract parameters from hash fragment
  function extractFromHash(hash: string, param: string): string | null {
    const hashWithoutPrefix = hash.startsWith('#') ? hash.substring(1) : hash;
    const regex = new RegExp(`${param}=([^&]*)`);
    const match = regex.exec(hashWithoutPrefix);
    return match ? match[1] : null;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="bg-red-50 border border-red-400 text-red-800 rounded-lg p-4 mb-4 max-w-md">
          <p className="font-medium">Authentication Error</p>
          <p className="text-sm">{error}</p>
        </div>
        <button 
          onClick={() => router.push('/auth/login')}
          className="mt-4 px-4 py-2 bg-brand-teal text-white rounded-md hover:bg-brand-teal/90 transition-colors"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-teal mb-4"></div>
      <p className="text-muted-foreground">Completing authentication...</p>
    </div>
  );
} 