import { NextResponse } from 'next/server';
import { createRouteSupabaseClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';

// POST endpoint to clear all sessions
export async function POST(request: Request) {
  try {
    console.log('[API] Clearing all sessions server-side');
    
    // Get Supabase client for the route handler
    const supabase = await createRouteSupabaseClient();
    
    // Get current session to check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log('[API] No active session found');
      return NextResponse.json({ 
        success: false, 
        message: 'No active session' 
      });
    }
    
    // Sign out all sessions for the current user
    const { error } = await supabase.auth.signOut({ 
      scope: 'global' 
    });
    
    if (error) {
      console.error('[API] Error clearing sessions:', error.message);
      return NextResponse.json({ 
        success: false, 
        message: error.message 
      }, { status: 500 });
    }
    
    // Clear cookies
    const cookieStore = cookies();
    cookieStore.getAll().forEach(cookie => {
      if (cookie.name.includes('supabase') || 
          cookie.name.includes('sb-') || 
          cookie.name.includes('auth')) {
        cookieStore.delete(cookie.name);
      }
    });
    
    console.log('[API] All sessions cleared successfully');
    
    return NextResponse.json({ 
      success: true, 
      message: 'All sessions cleared' 
    });
  } catch (error: any) {
    console.error('[API] Critical error in clear-sessions handler:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to clear sessions: ' + error.message 
    }, { status: 500 });
  }
} 