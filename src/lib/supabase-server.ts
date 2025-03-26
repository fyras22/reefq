'use server';

import { createServerComponentClient, createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

/**
 * Create a Supabase client for use in Server Components
 * Using PKCE flow for more secure authentication
 */
export async function createServerSupabaseClient() {
  const cookieStore = cookies();
  // Create the client with consistent PKCE configuration
  return createServerComponentClient({ cookies: () => cookieStore });
}

/**
 * Create a Supabase client for use in Route Handlers
 * Using PKCE flow for more secure authentication
 */
export async function createRouteSupabaseClient() {
  const cookieStore = cookies();
  // Create the client with consistent PKCE configuration
  return createRouteHandlerClient({ cookies: () => cookieStore });
} 