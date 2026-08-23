// Public, read-only client. Uses the anon key, which only has SELECT
// access on the cars table (see supabase-schema.sql). Safe to use
// in server components and client components alike.
import { createClient } from "@supabase/supabase-js";

export function getSupabasePublic() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
