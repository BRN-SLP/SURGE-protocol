import { createClient } from "@supabase/supabase-js";

let _supabaseAdmin: ReturnType<typeof createClient> | null = null;

/**
 * Supabase client with service-role privileges.
 * MUST only be called from server-side code (API routes, server actions).
 */
export function getSupabaseAdmin() {
  if (typeof window !== "undefined") {
    throw new Error("getSupabaseAdmin must not be called from client-side code");
  }
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }
  return _supabaseAdmin;
}
