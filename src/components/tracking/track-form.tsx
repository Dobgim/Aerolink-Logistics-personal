"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Layers, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EASE } from "@/components/ui/motion";
import { SAMPLE_TRACKING_NUMBER } from "@/lib/constants/site";
import { cn } from "@/lib/utils/cn";

interface TrackFormProps {
  /** Pre-fills the field when the tracking page reloads with a query. */
  defaultValue?: string;
  variant?: "card" | "inline";
  className?: string;
  autoFocus?: boolean;
}

const MAX_NUMBERS = 10;

export function TrackForm({
  defaultValue = "",
  variant = "card",
  className,
  autoFocus,
}: TrackFormProps) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [pending, startTransition] = useTransition();
  const [multi, setMulti] = useState(defaultValue.includes(","));
  const [value, setValue] = useState(
    defaultValue.includes(",") ? defaultValue.split(",").join("\n") : defaultValue,
  );
  const [error, setError] = useState<string | null>(null);

  function submit(event: FormEvent) {
    event.preventDefault();

    const numbers = value
      .split(/[\n,;]+/)
      .map((n) => n.trim())
      .filter(Boolean);

    if (numbers.length === 0) {
      setError("Enter at least one tracking number to continue.");
      return;
    }
    if (numbers.length > MAX_NUMBERS) {
      setError(`You can track up to ${MAX_NUMBERS} shipments at a time.`);
      return;
    }

    setError(null);
    startTransition(() => {
      router.push(`/tracking?number=${encodeURIComponent(numbers.join(","))}`);
    });
  }

  const isCard = variant === "card";

  return (
    <form
      onSubmit={submit}
      className={cn(
        isCard &&
          "rounded-2xl border border-ink-200/70 bg-white p-5 shadow-panel sm:rounded-[1.25rem] sm:p-7",
        className,
      )}
      noValidate
    >
      {isCard ? (
        <>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex size-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
              <PackageSearch aria-hidden className="size-5" />
            </span>
            <h2 className="text-xl font-extrabold text-ink-900 sm:text-[1.375rem]">
              Track Your Shipment
            </h2>
          </div>
          <p className="mt-2 text-sm text-ink-600">
            Enter the tracking number from your shipping label or confirmation email.
          </p>
        </>
      ) : null}

      <div className={cn(isCard && "mt-5")}>
        <AnimatePresence mode="wait" initial={false}>
          {multi ? (
            <motion.div
              key="multi"
              initial={reduce ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: EASE }}
            >
              <label htmlFor="tracking-numbers" className="sr-only">
                Tracking numbers, one per line
              </label>
              <textarea
                id="tracking-numbers"
                name="numbers"
                rows={4}
                value={value}
                autoFocus={autoFocus}
                onChange={(e) => setValue(e.target.value)}
                placeholder={`${SAMPLE_TRACKING_NUMBER}\nFCX-2026-114872`}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "tracking-error" : "tracking-hint"}
                className="w-full resize-y rounded-xl border border-ink-300 px-4 py-3 font-mono text-[0.9375rem] tracking-tight text-ink-900 placeholder:font-sans placeholder:text-ink-400 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
              />
              <p id="tracking-hint" className="mt-2 text-xs text-ink-500">
                One tracking number per line — up to {MAX_NUMBERS} shipments.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="single"
              initial={reduce ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: EASE }}
            >
              <label htmlFor="tracking-number" className="sr-only">
                Tracking number
              </label>
              <input
                id="tracking-number"
                name="number"
                type="text"
                inputMode="text"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                autoFocus={autoFocus}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter your tracking number"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "tracking-error" : undefined}
                className={cn(
                  "h-13 w-full rounded-xl border px-4 text-base font-semibold tracking-tight text-ink-900 placeholder:font-normal placeholder:text-ink-400 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 sm:h-14",
                  error ? "border-red-400" : "border-ink-300 hover:border-ink-400",
                )}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {error ? (
          <p id="tracking-error" role="alert" className="mt-2 text-sm font-medium text-red-600">
            {error}
          </p>
        ) : null}

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => {
              setMulti((v) => !v);
              setError(null);
            }}
            className="inline-flex items-center gap-2 self-start rounded-lg text-sm font-semibold text-brand-700 transition-colors hover:text-brand-900"
          >
            <Layers aria-hidden className="size-4" />
            {multi ? "Track a single shipment" : "Track multiple shipments"}
          </button>

          <Button
            type="submit"
            size="lg"
            loading={pending}
            iconRight={<ArrowRight aria-hidden className="size-4" />}
            className="w-full sm:w-auto"
          >
            {pending ? "Searching" : "Track Shipment"}
          </Button>
        </div>
      </div>

      {/*
        No "try this one" shortcut: it can only point at a real consignment,
        and offering a stranger someone else's is not ours to do. The format is
        shown in the field's placeholder instead.
      */}
      {isCard ? (
        <p className="mt-4 border-t border-ink-200 pt-4 text-xs text-ink-500">
          Your tracking number is on the confirmation email and the shipping label.
        </p>
      ) : null}
    </form>
  );
}
