import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { registerSchema } from "@/lib/validations/schemas";
import { badRequest, handle, ok } from "@/lib/api/respond";
import { SESSION_COOKIE, encodeSession } from "@/lib/auth/session";
import { getAdminSupabase, getServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { store, nextId } from "@/lib/data/local-store";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  return handle(async () => {
    const input = registerSchema.parse(await request.json());

    if (isSupabaseConfigured()) {
      const supabase = await getServerSupabase();
      const { data, error } = await supabase!.auth.signUp({
        email: input.email,
        password: input.password,
        options: { data: { name: input.name } },
      });

      if (error) return badRequest(error.message);

      // Mirror the auth user into the profile table. New accounts are always
      // customers — admin rights are granted in the database, never by signup.
      const admin = getAdminSupabase();
      if (admin && data.user) {
        await admin.from("users").upsert({
          id: data.user.id,
          name: input.name,
          email: input.email,
          phone: input.phone ?? null,
          role: "customer",
        });
      }

      return ok(
        {
          user: { email: input.email, role: "customer" },
          needsEmailConfirmation: !data.session,
        },
        201,
      );
    }

    // Local backend: create the customer locally and start a session.
    const db = store();
    if (db.users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
      return badRequest("An account already exists for that email address");
    }

    const user = {
      id: nextId("usr"),
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      role: "customer" as const,
      created_at: new Date().toISOString(),
    };
    db.users.unshift(user);

    const jar = await cookies();
    jar.set(
      SESSION_COOKIE,
      encodeSession({ id: user.id, email: user.email, name: user.name, role: "customer" }),
      {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 8,
      },
    );

    return ok({ user: { email: user.email, role: user.role }, needsEmailConfirmation: false }, 201);
  });
}
