/**
 * Supabase project configuration — this project's OWN Supabase instance.
 *
 * This app deliberately does NOT use a Lovable-managed backend. These values
 * are the single source of truth and intentionally take precedence over any
 * platform-injected SUPABASE_* / VITE_SUPABASE_* variables.
 *
 * Both values are public-safe:
 *  - the project URL is public by design
 *  - the publishable (anon) key is meant to ship to the browser; access is
 *    controlled by Row Level Security, not by hiding this key
 *
 * Never put the service role key or the database connection string here.
 * The service role key belongs in the `SUPABASE_SERVICE_ROLE_KEY` server
 * environment variable only.
 *
 * To point at a different instance (staging, a new project), either edit the
 * literals below or set VITE_OWN_SUPABASE_URL / VITE_OWN_SUPABASE_PUBLISHABLE_KEY.
 */

const viteEnv = typeof import.meta !== "undefined" ? import.meta.env : undefined;
const nodeEnv = typeof process !== "undefined" ? process.env : undefined;

export const SUPABASE_URL: string =
  viteEnv?.["VITE_OWN_SUPABASE_URL"] ||
  nodeEnv?.["OWN_SUPABASE_URL"] ||
  "https://rbwimpvcbklqodqsfcvf.supabase.co";

export const SUPABASE_PUBLISHABLE_KEY: string =
  viteEnv?.["VITE_OWN_SUPABASE_PUBLISHABLE_KEY"] ||
  nodeEnv?.["OWN_SUPABASE_PUBLISHABLE_KEY"] ||
  "sb_publishable_eI-NNuflW0qxNbTgck71uQ_cCDWfe8o";

/** Service role key — server-only, never bundled to the browser. */
export function getServiceRoleKey(): string | undefined {
  return nodeEnv?.["SUPABASE_SERVICE_ROLE_KEY"];
}
