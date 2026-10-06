import { createClient } from "@supabase/supabase-js";

const url = process.env.REACT_APP_SUPABASE_URL || "";
const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "";

export const supabaseConfigured = Boolean(url && anonKey);

export const supabase = createClient(url || "https://placeholder.supabase.co", anonKey || "placeholder", {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

export type IoptRow = {
  email: string;
  first_name: string;
  last_name: string | null;
  team: string;
  rs: number;
  lp: number;
  ha: number;
  ri: number;
  dominant: string;
  secondary: string;
  pattern: string;
};
