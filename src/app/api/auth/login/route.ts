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
import { isSupabaseConfigured, missingSupabaseEnv } from "@/lib/supabase/env";
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

      /*
       * Read the role with the service-role client when there is one, and
       * otherwise with the caller's own session: RLS lets a signed-in user read
       * their own profile row, so the answer is the same either way.
       *
       * Falling back matters. Treating a missing service-role key as "this
       * person is a customer" silently locks an administrator out of their own
       * dashboard and blames their account for a configuration gap.
       */
      const { data: profile } = await (getAdminSupabase() ?? supabase!)
        .from("users")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();
      const role: UserRole = (profile?.role as UserRole) ?? "customer";

      return ok({ user: { email: data.user.email, role } });
    }

    /*
     * No Supabase project, and no local account has a password set — so there
     * is no credential store at all and nothing could ever sign in. Saying
     * "incorrect password" would be a lie that sends someone hunting for a typo
     * in a credential that was never going to work; the fault is configuration.
     */
    if (Object.keys(LOCAL_ACCOUNTS).length === 0) {
      const missing = missingSupabaseEnv();
      const names = missing.join(" and ");
      const verb = missing.length === 1 ? "is" : "are";
      const them = missing.length === 1 ? "it" : "them";
      return serverError(
        `Sign-in is not configured: ${names} ${verb} not visible to the server. ` +
          `Check the spelling exactly — a variable saved under a different name cannot be read. ` +
          `On Vercel, set ${them} and then redeploy: NEXT_PUBLIC_ values are baked in at build time, ` +
          `so an existing deployment will not pick ${them} up.`,
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
