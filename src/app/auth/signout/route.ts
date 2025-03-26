import { NextResponse } from 'next/server';
import { createRouteSupabaseClient } from '@/lib/supabase-server';

export async function POST() {
  try {
    console.log('[Auth] Processing sign-out request');
    
    // Create Supabase client
    const supabase = await createRouteSupabaseClient();

    // Sign out (only current session)
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('[Auth] Error during sign-out:', error.message);
      
      // Fallback to redirecting to home page on error
      return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
    }
    
    console.log('[Auth] Sign-out successful');
    
    // Try to call the clear-sessions API to ensure all sessions are cleared
    try {
      // This is a server-to-server call, so we need to use the full URL
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      await fetch(`${baseUrl}/api/clear-sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('[Auth] Called clear-sessions API');
    } catch (apiError) {
      console.error('[Auth] Failed to call clear-sessions API:', apiError);
      // Continue with the redirect even if this fails
    }
    
    // Redirect to landing page after successful sign-out
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
  } catch (error: any) {
    console.error('[Auth] Critical error during sign-out:', error);
    
    // Fallback to redirecting to home page on error
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
  }
} 