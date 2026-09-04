"use client";

import { useState, type FormEvent } from "react";
import { KeyRound, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";

export function ForgotPasswordForm() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState<{ emailDeliveryConfigured: boolean } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());

    setSubmitting(true);
    setErrors({});

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const payload = await response.json();

      if (!response.ok) {
        setErrors((payload.details as Record<string, string>) ?? {});
        return;
      }

      setSent({ emailDeliveryConfigured: Boolean(payload.emailDeliveryConfigured) });
    } catch {
      setErrors({ email: "Network error — please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
        <span className="inline-flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          <MailCheck aria-hidden className="size-6" />
        </span>
        <h2 className="mt-4 text-lg font-bold text-ink-900">Check your inbox</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">
          If a Royal Prime account exists for that address, we have sent a link to reset the
          password. The link expires in one hour.
        </p>

        {!sent.emailDeliveryConfigured ? (
          <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
            <strong className="font-bold">Local backend:</strong> no email provider is connected, so
            no message was actually delivered. Connect Supabase Auth and password resets are sent
            for real.
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      <Input
        name="email"
        type="email"
        label="Email address"
        required
        autoFocus
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email}
      />
      <Button
        type="submit"
        size="lg"
        loading={submitting}
        icon={<KeyRound aria-hidden className="size-4" />}
        className="w-full"
      >
        {submitting ? "Sending link" : "Send reset link"}
      </Button>
    </form>
  );
}
