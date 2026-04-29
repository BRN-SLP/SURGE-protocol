import { createClient } from "@supabase/supabase-js";

let _supabase: ReturnType<typeof createClient> | null = null;
export function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return _supabase;
}

// Convenience export — lazy singleton, safe to use anywhere
export const supabase = new Proxy({} as ReturnType<typeof getSupabase>, {
  get: (_, prop) => getSupabase()[prop as keyof ReturnType<typeof getSupabase>],
});
