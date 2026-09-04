import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { UserRole } from "@/types";
import { getServerSupabase, getAdminSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const SESSION_COOKIE = "freightcargoxpress_session";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

/**
 * Local accounts used only while no Supabase project is configured. Once
 * Supabase Auth is wired up these are ignored entirely and every credential is
 * verified by Supabase.
 *
 * Passwords are never committed. Each is read from the environment, and an
 * account with no password set simply does not exist — so a deployment that
 * forgets to unset them still cannot be signed into with a published default.
 */
export const LOCAL_ACCOUNTS: Record<string, { password: string; user: SessionUser }> =
  Object.fromEntries(
    (
      [
        [
          "admin@freightcargoxpress.local",
          process.env.LOCAL_ADMIN_PASSWORD,
          { id: "usr_admin", name: "FreightCargoXpress Operations", role: "admin" as const },
        ],
        [
          "customer@freightcargoxpress.local",
          process.env.LOCAL_CUSTOMER_PASSWORD,
          { id: "usr_customer", name: "Camille Moreau", role: "customer" as const },
        ],
      ] as const
    )
      .filter(([, password]) => Boolean(password))
      .map(([email, password, profile]) => [
        email,
        { password: password as string, user: { ...profile, email } },
      ]),
  );

function secret(): string {
  return process.env.AUTH_SECRET ?? "freightcargoxpress-development-secret-change-me";
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

/** `<base64url(json)>.<hmac>` — tamper-evident, verified on every request. */
export function encodeSession(user: SessionUser): string {
  const body = Buffer.from(JSON.stringify(user)).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function decodeSession(token: string | undefined): SessionUser | null {
  if (!token) return null;
  const [body, mac] = token.split(".");
  if (!body || !mac) return null;

  const expected = sign(body);
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString()) as SessionUser;
    if (!parsed?.email || (parsed.role !== "admin" && parsed.role !== "customer")) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * The single source of truth for "who is making this request". Every protected
 * page and API route calls this on the server — route protection is never left
 * to the client.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  if (isSupabaseConfigured()) {
    const supabase = await getServerSupabase();
    const { data } = (await supabase?.auth.getUser()) ?? { data: { user: null } };
    const authUser = data?.user;
    if (!authUser) return null;

    // Role lives in the `users` table, not in client-editable metadata.
    let role: UserRole = "customer";
    let name = (authUser.user_metadata?.name as string) ?? authUser.email ?? "Customer";

    /*
     * The service-role client when configured, otherwise the caller's own
     * session — RLS lets a signed-in user read their own profile row, so the
     * role resolves either way. Without this fallback a missing service-role
     * key would quietly demote every administrator to a customer and lock them
     * out of the dashboard.
     */
    const reader = getAdminSupabase() ?? supabase;
    if (reader) {
      const { data: profile } = await reader
        .from("users")
        .select("name, role")
        .eq("id", authUser.id)
        .maybeSingle();
      if (profile) {
        role = (profile.role as UserRole) ?? "customer";
        name = (profile.name as string) ?? name;
      }
    }

    return { id: authUser.id, email: authUser.email ?? "", name, role };
  }

  const jar = await cookies();
  return decodeSession(jar.get(SESSION_COOKIE)?.value);
}

export async function requireRole(role: UserRole): Promise<SessionUser | null> {
  const user = await getSessionUser();
  if (!user) return null;
  if (role === "admin" && user.role !== "admin") return null;
  return user;
}
