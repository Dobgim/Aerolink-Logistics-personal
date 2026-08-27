export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * The service-role key is read lazily and only ever from server modules — it is
 * never imported into a Client Component and never sent to the browser.
 */
export function serviceRoleKey(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
}

/** True once a real Supabase project is wired up through the environment. */
export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export function hasServiceRole(): boolean {
  return Boolean(SUPABASE_URL && serviceRoleKey());
}
