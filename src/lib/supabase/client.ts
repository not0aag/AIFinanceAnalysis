import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Use dummy values during build if env vars are missing
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "placeholder-anon-key-for-build-only";

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
