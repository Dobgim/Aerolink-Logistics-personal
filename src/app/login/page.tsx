import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your AeroLink Logistics account to manage shipments and collections.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Sign in to AeroLink"
      description="Manage your shipments, book collections and see the full record for everything on your account."
      aside={{
        quote:
          "Every hand-off is scanned, and every scan reaches the customer. That is the whole product.",
        attribution: "AeroLink operations",
      }}
      footer={
        <div className="space-y-2">
          <p>
            <Link href="/forgot-password" className="font-semibold text-brand-700 hover:text-brand-900">
              Forgot your password?
            </Link>
          </p>
          <p>
            New to AeroLink?{" "}
            <Link href="/register" className="font-semibold text-brand-700 hover:text-brand-900">
              Create an account
            </Link>
          </p>
        </div>
      }
    >
      <LoginForm redirectTo="/" />
    </AuthShell>
  );
}
