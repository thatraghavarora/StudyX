import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "https://gqpcgkfelikznvsqmohg.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  // Keep auth failures explicit during local setup without exposing secrets in source.
  console.warn("Missing VITE_SUPABASE_ANON_KEY. Add your public Supabase anon key to .env.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey ?? "missing-anon-key");
