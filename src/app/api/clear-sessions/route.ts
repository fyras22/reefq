import { NextResponse } from 'next/server';
// import { createRouteSupabaseClient } from '@/lib/supabase-server'; // Remove old import
import { createClient } from '@/lib/supabase/server'; // Import server client utility
import { cookies } from 'next/headers';

// POST endpoint to clear all sessions
export async function POST(request: Request) {
  try {
    console.log('[API] Clearing all sessions server-side');

    // Get Supabase client using the server utility
    const cookieStore = cookies(); // cookies() must be called before createClient
    const supabase = createClient(); // Use the new server client utility

    // Check if user is authenticated using getUser()
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.log('[API] No active session found (user is not authenticated)');
      // 401 Unauthorized is more appropriate here
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Sign out the current session (Supabase SSR handles cookie removal)
    // Signing out with { scope: 'global' } might require specific backend setup or policies.
    // Using standard signOut which clears the current session handled by the middleware/client.
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('[API] Error signing out:', error.message);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    // Note: Manual cookie clearing might be redundant or interfere with @supabase/ssr handling.
    // Relying on supabase.auth.signOut() and the middleware/client utils is preferred.
    /*
    const cookieStore = cookies();
    cookieStore.getAll().forEach(cookie => {
      if (cookie.name.includes('supabase') || cookie.name.includes('sb-')) {
        cookieStore.delete(cookie.name);
      }
    });
    */

    console.log('[API] User signed out successfully (current session cleared)');

    return NextResponse.json({ success: true, message: 'Signed out successfully' });
  } catch (error: any) {
    console.error('[API] Critical error in clear-sessions handler:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to clear sessions: ' + error.message 
    }, { status: 500 });
  }
} 