import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Use dummy values during build if env vars are missing
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MjAsImV4cCI6MTk2MDc2ODgyMH0.M9n8KCBcHMPrIXQJwT3DNn2g2O0M97w8lEjfAKo5nuw';
  
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
