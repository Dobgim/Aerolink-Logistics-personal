import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create a Royal Prime Logistics account to book collections and track your shipments.",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your Royal Prime account"
      description="Book collections, keep your shipment history in one place and get delivery notifications by email."
      aside={{
        quote:
          "Every lane run properly — from the collection scan to the doorstep.",
        attribution: "Royal Prime Logistics",
      }}
      footer={
        <p>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-700 hover:text-brand-900">
            Sign in
          </Link>
        </p>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
