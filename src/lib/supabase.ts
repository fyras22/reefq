import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://eptoncbrrsobbqlzxhoa.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwdG9uY2JycnNvYmJxbHp4aG9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEwNjIxMTksImV4cCI6MjAzNjYzODExOX0.v2OvOuV6WxQy1RvrZ7iLCt3_AIDBa4C5JlUrCfmEeLA";

// Create a Supabase client for use in the browser with PKCE flow
// and automatic storage management
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Using pkce flow for better security
    flowType: "pkce",
    // Use default storage to ensure proper state management
    storage: {
      getItem: (key) => {
        if (typeof window === "undefined") return null;
        return window.localStorage.getItem(key);
      },
      setItem: (key, value) => {
        if (typeof window === "undefined") return;
        window.localStorage.setItem(key, value);
      },
      removeItem: (key) => {
        if (typeof window === "undefined") return;
        window.localStorage.removeItem(key);
      },
    },
  },
});

export default supabase;
