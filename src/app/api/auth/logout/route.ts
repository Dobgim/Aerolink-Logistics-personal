import { cookies } from "next/headers";
import { handle, ok } from "@/lib/api/respond";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { getServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export async function POST() {
  return handle(async () => {
    if (isSupabaseConfigured()) {
      const supabase = await getServerSupabase();
      await supabase?.auth.signOut();
    }

    const jar = await cookies();
    jar.delete(SESSION_COOKIE);

    return ok({ signedOut: true });
  });
}
