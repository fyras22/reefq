import { NextResponse } from 'next/server';
import { createRouteSupabaseClient } from '@/lib/supabase-server';

// Mark this route as dynamic to prevent static generation
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const next = requestUrl.searchParams.get('next') || '/dashboard';
    const origin = requestUrl.origin; // This will now be properly defined at runtime
    const hash = requestUrl.hash;
    const error = requestUrl.searchParams.get('error');
    const errorDescription = requestUrl.searchParams.get('error_description');
    const state = requestUrl.searchParams.get('state');

    console.log(`[Auth Callback] Processing OAuth callback:`);
    console.log(`- URL: ${requestUrl.toString()}`);
    console.log(`- Code parameter: ${!!code}`);
    console.log(`- Next parameter: ${next}`);
    console.log(`- State parameter: ${!!state}`);
    console.log(`- Hash exists: ${!!hash && hash.length > 0}`);
    console.log(`- Error: ${error || 'none'}`);
    console.log(`- Error description: ${errorDescription || 'none'}`);
    
    // Handle error case from OAuth provider
    if (error) {
      console.error(`[Auth Callback] Error from OAuth provider: ${error}: ${errorDescription}`);
      
      // If we get a bad_oauth_state error, provide a more specific error message
      if (error === 'invalid_request' && errorDescription?.includes('bad_oauth_state')) {
        return NextResponse.redirect(
          `${origin}/auth/login?error=${encodeURIComponent('Authentication session expired. Please try again.')}`
        );
      }
      
      return NextResponse.redirect(
        `${origin}/auth/login?error=${encodeURIComponent(errorDescription || error)}`
      );
    }
    
    // If we have a hash with access_token (implicit flow), we need to preserve it
    if (hash && hash.includes('access_token')) {
      console.log('[Auth Callback] Hash contains access_token, forwarding to set-login-flag');
      
      // Forward the hash to the client-side handler
      return NextResponse.redirect(
        new URL(`/auth/set-login-flag?redirectTo=${encodeURIComponent(next)}&hash=${encodeURIComponent(hash)}`, origin)
      );
    }

    // If we have a code parameter, exchange it for a session (PKCE flow)
    if (code) {
      console.log('[Auth Callback] Exchanging code for session');
      
      try {
        const supabase = await createRouteSupabaseClient();
        
        // Exchange the code for a session
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          console.error('[Auth Callback] Error exchanging code for session:', error.message);
          return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent('Authentication failed. Please try again.')}`);
        }

        // Verify we have a session
        if (!data.session) {
          console.error('[Auth Callback] No session returned after code exchange');
          return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent('Failed to create session')}`);
        }
        
        console.log('[Auth Callback] Session established successfully');
        
        // Set cookies for the session
        const response = NextResponse.redirect(
          new URL(`/auth/set-login-flag?redirectTo=${encodeURIComponent(next)}`, origin)
        );
        
        // Set the session cookie
        response.cookies.set('sb-access-token', data.session.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7 // 1 week
        });
        
        return response;
      } catch (exchangeError: any) {
        console.error('[Auth Callback] Exception during code exchange:', exchangeError);
        return NextResponse.redirect(
          `${origin}/auth/login?error=${encodeURIComponent('Authentication process failed')}`
        );
      }
    }
    
    // Neither code nor access_token hash found
    console.error('[Auth Callback] No authentication parameters found');
    return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent('Missing authentication parameters')}`);
  } catch (error: any) {
    // Only access origin within the try/catch block
    const fallbackOrigin = new URL(request.url).origin;
    console.error('[Auth Callback] Critical error in callback handler:', error);
    return NextResponse.redirect(`${fallbackOrigin}/auth/login?error=${encodeURIComponent('Something went wrong during authentication')}`);
  }
} 