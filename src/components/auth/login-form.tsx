"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertCircle, Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { EASE } from "@/components/ui/motion";
import { useToast } from "@/components/ui/toast";

interface Props {
  /** Where to send a successful sign-in that is not an admin. */
  redirectTo?: string;
  /** Admin sign-in refuses customer accounts outright. */
  adminOnly?: boolean;
}

export function LoginForm({ redirectTo = "/", adminOnly = false }: Props) {
  const router = useRouter();
  const toast = useToast();
  const reduce = useReducedMotion();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());

    setSubmitting(true);
    setFormError(null);
    setErrors({});

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const payload = await response.json();

      if (!response.ok) {
        setErrors((payload.details as Record<string, string>) ?? {});
        setFormError(payload.error ?? "We could not sign you in");
        return;
      }

      if (adminOnly && payload.user?.role !== "admin") {
        setFormError("That account does not have administrator access.");
        await fetch("/api/auth/logout", { method: "POST" });
        return;
      }

      toast.success("Signed in", `Welcome back, ${payload.user?.email ?? "there"}.`);
      const destination = payload.user?.role === "admin" ? "/admin" : redirectTo;
      router.push(destination);
      router.refresh();
    } catch {
      setFormError("Network error — check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
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
        name="email"
        type="email"
        label="Email address"
        required
        autoComplete="email"
        autoFocus
        placeholder="you@example.com"
        error={errors.email}
      />

      <div className="relative">
        <Input
          name="password"
          type={showPassword ? "text" : "password"}
          label="Password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password}
          className="pr-11"
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-3 top-[2.1rem] rounded-md p-1 text-ink-500 transition-colors hover:text-ink-800"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff aria-hidden className="size-4" />
          ) : (
            <Eye aria-hidden className="size-4" />
          )}
        </button>
      </div>

      <Button
        type="submit"
        size="lg"
        loading={submitting}
        icon={<LogIn aria-hidden className="size-4" />}
        className="w-full"
      >
        {submitting ? "Signing in" : adminOnly ? "Sign in to admin" : "Sign in"}
      </Button>

    </form>
  );
}
