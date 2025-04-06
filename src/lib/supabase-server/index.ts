import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// This file is for server-side usage of Supabase
// For client-side usage, use the ../supabase.ts file

export const createServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables for server');
  }

  // Create a Supabase client with the service role key for server operations
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    }
  });
};

// Create a Supabase client that uses cookies for server components
export const createServerComponentClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  const cookieStore = cookies();
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      // Use cookies storage if available
      storage: {
        getItem: (key) => {
          const value = cookieStore.get(key)?.value;
          return value ?? null;
        },
        setItem: () => {
          // We don't need to implement this as cookie setting is handled by Supabase Auth
          return;
        },
        removeItem: () => {
          // We don't need to implement this as cookie removal is handled by Supabase Auth
          return;
        },
      },
    },
  });
};

// Default export for convenience
export default createServerClient; 