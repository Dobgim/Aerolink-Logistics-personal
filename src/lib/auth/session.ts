import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { UserRole } from "@/types";
import { getServerSupabase, getAdminSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const SESSION_COOKIE = "aerolink_session";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

/**
 * Demo accounts used only while no Supabase project is configured. Once
 * Supabase Auth is wired up these are ignored entirely and every credential is
 * verified by Supabase.
 */
export const DEMO_ACCOUNTS: Record<string, { password: string; user: SessionUser }> = {
  "admin@aerolink.demo": {
    password: "AeroLink#2026",
    user: {
      id: "usr_admin",
      email: "admin@aerolink.demo",
      name: "AeroLink Operations",
      role: "admin",
    },
  },
  "customer@aerolink.demo": {
    password: "Customer#2026",
    user: {
      id: "usr_customer",
      email: "customer@aerolink.demo",
      name: "Camille Moreau",
      role: "customer",
    },
  },
};

function secret(): string {
  return process.env.AUTH_SECRET ?? "aerolink-development-secret-change-me";
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
    const admin = getAdminSupabase();
    let role: UserRole = "customer";
    let name = (authUser.user_metadata?.name as string) ?? authUser.email ?? "Customer";

    if (admin) {
      const { data: profile } = await admin
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
