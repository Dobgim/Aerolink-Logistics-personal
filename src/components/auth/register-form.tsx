"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertCircle, MailCheck, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { EASE } from "@/components/ui/motion";
import { useToast } from "@/components/ui/toast";

export function RegisterForm() {
  const router = useRouter();
  const toast = useToast();
  const reduce = useReducedMotion();
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmEmail, setConfirmEmail] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());

    setSubmitting(true);
    setFormError(null);
    setErrors({});

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const payload = await response.json();

      if (!response.ok) {
        setErrors((payload.details as Record<string, string>) ?? {});
        setFormError(payload.error ?? "We could not create your account");
        return;
      }

      if (payload.needsEmailConfirmation) {
        setConfirmEmail(true);
        return;
      }

      toast.success("Account created", "You are signed in and ready to ship.");
      router.push("/");
      router.refresh();
    } catch {
      setFormError("Network error — check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmEmail) {
    return (
      <div className="rounded-2xl border border-ink-200 bg-white p-6 text-center shadow-card">
        <span className="mx-auto inline-flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          <MailCheck aria-hidden className="size-6" />
        </span>
        <h2 className="mt-4 text-lg font-bold text-ink-900">Confirm your email</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">
          We have sent a confirmation link to your inbox. Open it to activate your Royal Prime account,
          then sign in.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      <AnimatePresence>
        {formError ? (
          <motion.p
            role="alert"
            initial={reduce ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm font-medium text-red-700"
          >
            <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
            {formError}
          </motion.p>
        ) : null}
      </AnimatePresence>

      <Input
        name="name"
        label="Full name"
        required
        autoComplete="name"
        autoFocus
        placeholder="Daniel Whitfield"
        error={errors.name}
      />
      <Input
        name="email"
        type="email"
        label="Email address"
        required
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email}
      />
      <Input
        name="phone"
        type="tel"
        label="Phone number"
        autoComplete="tel"
        placeholder="+1 (212) 555-0142"
        error={errors.phone}
      />
      <Input
        name="password"
        type="password"
        label="Password"
        required
        minLength={6}
        autoComplete="new-password"
        hint="At least 6 characters."
        error={errors.password}
      />

      <Button
        type="submit"
        size="lg"
        loading={submitting}
        icon={<UserPlus aria-hidden className="size-4" />}
        className="w-full"
      >
        {submitting ? "Creating account" : "Create account"}
      </Button>

      <p className="text-xs leading-relaxed text-ink-500">
        By creating an account you agree to our terms of carriage and privacy policy. New accounts
        are always customer accounts — administrator access is granted in the database.
      </p>
    </form>
  );
}
