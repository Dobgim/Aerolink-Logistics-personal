import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Administrator sign in",
  description: "Sign in to the FreightCargoXpress operations dashboard.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const user = await getSessionUser();
  if (user?.role === "admin") redirect("/admin");

  return (
    <AuthShell
      title="Administrator sign in"
      description="The operations dashboard for creating shipments, posting tracking scans and handling support requests."
      aside={{
        quote:
          "Post the scan, and the customer's timeline, map and delivery estimate all move with it.",
        attribution: "FreightCargoXpress operations dashboard",
      }}
      footer={
        <p>
          Not an administrator?{" "}
          <Link href="/login" className="font-semibold text-brand-700 hover:text-brand-900">
            Customer sign in
          </Link>
        </p>
      }
    >
      <LoginForm adminOnly redirectTo="/admin" />
    </AuthShell>
  );
}
