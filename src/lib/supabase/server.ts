import "server-only";

import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  hasServiceRole,
  isSupabaseConfigured,
  serviceRoleKey,
} from "./env";

/**
 * Request-scoped client that carries the visitor's session cookie, so every
 * query runs under that user's Row Level Security policies.
 */
export async function getServerSupabase(): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured()) return null;
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component render — the proxy layer refreshes
          // the session cookie instead, so this is safe to ignore.
        }
      },
    },
  });
}

/**
 * Service-role client. Server-only, bypasses RLS, and must never be reachable
 * from a Client Component. Guard every caller with your own authorization
 * check before using it.
 */
export function getAdminSupabase(): SupabaseClient | null {
  if (!hasServiceRole()) return null;
  return createClient(SUPABASE_URL, serviceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
