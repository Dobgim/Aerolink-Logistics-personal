import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Reset your password",
  description: "Request a password reset link for your FreightCargoXpress account.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset your password"
      description="Enter the email address on your account and we will send a link to set a new password."
      aside={{
        quote: "Account security is handled by Supabase Auth — we never store your password.",
        attribution: "FreightCargoXpress",
      }}
      footer={
        <p>
          Remembered it?{" "}
          <Link href="/login" className="font-semibold text-brand-700 hover:text-brand-900">
            Back to sign in
          </Link>
        </p>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
