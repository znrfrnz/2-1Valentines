import { createClient } from "@supabase/supabase-js";

/**
 * Create a Supabase client for server-side use (API routes, server components).
 *
 * This app doesn't require user authentication — messages are posted anonymously —
 * so we use a simple createClient instead of the SSR cookie-based approach.
 * This also avoids the `cookies()` dynamic server usage issue during static generation.
 */
export function createSupabaseServer() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables",
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}
