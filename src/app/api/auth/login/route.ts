import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { loginSchema } from "@/lib/validations/schemas";
import { handle, ok, serverError, unauthorized } from "@/lib/api/respond";
import {
  LOCAL_ACCOUNTS,
  SESSION_COOKIE,
  encodeSession,
} from "@/lib/auth/session";
import { getAdminSupabase, getServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { UserRole } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  return handle(async () => {
    const { email, password } = loginSchema.parse(await request.json());

    if (isSupabaseConfigured()) {
      const supabase = await getServerSupabase();
      const { data, error } = await supabase!.auth.signInWithPassword({ email, password });
      if (error || !data.user) {
        /*
         * Supabase rate-limits sign-ins per address. Reporting that as a wrong
         * password sends someone hunting for a typo in a credential that is
         * actually correct.
         */
        if (error?.status === 429) {
          return unauthorized("Too many sign-in attempts. Wait a minute and try again.");
        }
        return unauthorized("Incorrect email or password");
      }

      let role: UserRole = "customer";
      const admin = getAdminSupabase();
      if (admin) {
        const { data: profile } = await admin
          .from("users")
          .select("role")
          .eq("id", data.user.id)
          .maybeSingle();
        role = (profile?.role as UserRole) ?? "customer";
      }

      return ok({ user: { email: data.user.email, role } });
    }

    /*
     * No Supabase project, and no local account has a password set — so there
     * is no credential store at all and nothing could ever sign in. Saying
     * "incorrect password" would be a lie that sends someone hunting for a typo
     * in a credential that was never going to work; the fault is configuration.
     */
    if (Object.keys(LOCAL_ACCOUNTS).length === 0) {
      return serverError(
        "Sign-in is not configured on this deployment. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then restart the server.",
      );
    }

    const account = LOCAL_ACCOUNTS[email.toLowerCase()];
    if (!account || account.password !== password) {
      return unauthorized("Incorrect email or password");
    }

    const jar = await cookies();
    jar.set(SESSION_COOKIE, encodeSession(account.user), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return ok({ user: { email: account.user.email, role: account.user.role } });
  });
}
