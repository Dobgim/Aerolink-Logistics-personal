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

/**
 * Which of the two required variables the server cannot actually see, named
 * exactly as the code reads them.
 *
 * Worth naming precisely: a variable set under a misspelt name is invisible
 * here and indistinguishable from one that was never set, so an error that
 * says which one is missing is the difference between a fix and a guess.
 */
export function missingSupabaseEnv(): string[] {
  const missing: string[] = [];
  if (!SUPABASE_URL) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!SUPABASE_ANON_KEY) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  return missing;
}

export function hasServiceRole(): boolean {
  return Boolean(SUPABASE_URL && serviceRoleKey());
}
