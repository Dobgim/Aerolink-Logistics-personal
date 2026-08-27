import type { NextRequest } from "next/server";
import { forgotPasswordSchema } from "@/lib/validations/schemas";
import { handle, ok } from "@/lib/api/respond";
import { getServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { SITE } from "@/lib/constants/site";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  return handle(async () => {
    const { email } = forgotPasswordSchema.parse(await request.json());

    if (isSupabaseConfigured()) {
      const supabase = await getServerSupabase();
      // Always report success — confirming which addresses exist would leak
      // account information to anyone probing the endpoint.
      await supabase?.auth.resetPasswordForEmail(email, {
        redirectTo: `${SITE.url}/login`,
      });
      return ok({ sent: true, emailDeliveryConfigured: true });
    }

    return ok({ sent: true, emailDeliveryConfigured: false });
  });
}
