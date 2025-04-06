import { createServerComponentClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

// This is the route that Supabase Auth calls when a user completes the OAuth flow
// or when a passwordless login email link is clicked
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  // If no code is provided in the request, redirect to login
  if (!code) {
    return NextResponse.redirect(
      new URL('/auth/login?error=No+auth+code+provided', request.url)
    );
  }

  try {
    const supabase = createServerComponentClient();
    
    // Exchange the auth code for session
    // This automatically sets the cookies in the response
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent(error.message)}`, request.url)
      );
    }

    // Redirect to the dashboard or a specified redirect_to parameter
    const redirectTo = requestUrl.searchParams.get('redirect_to') || '/dashboard';
    return NextResponse.redirect(new URL(redirectTo, request.url));
  } catch (error: any) {
    console.error('Unexpected error in auth callback:', error);
    return NextResponse.redirect(
      new URL('/auth/login?error=Unexpected+error+during+sign+in', request.url)
    );
  }
} 