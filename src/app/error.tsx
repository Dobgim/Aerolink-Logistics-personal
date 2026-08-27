"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/primitives";
import { Logo } from "@/components/layout/logo";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app] unhandled error", error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col bg-ink-950">
      <header className="border-b border-white/10">
        <Container className="py-4">
          <Logo tone="light" />
        </Container>
      </header>

      <main id="main" className="flex flex-1 items-center py-16">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex size-16 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-300">
              <AlertTriangle aria-hidden className="size-8" />
            </span>

            <p className="mt-8 font-display text-6xl font-extrabold text-white/15 sm:text-7xl">
              500
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
              Something went wrong
            </h1>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-ink-300">
              We hit an unexpected error loading this page. Your shipment data is unaffected —
              try again, and if it keeps happening our support team can help.
            </p>

            {error.digest ? (
              <p className="mt-4 inline-block rounded-lg bg-white/10 px-3 py-1.5 font-mono text-xs text-ink-400">
                Reference {error.digest}
              </p>
            ) : null}

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                variant="light"
                onClick={reset}
                icon={<RotateCcw aria-hidden className="size-4" />}
              >
                Try again
              </Button>
              <ButtonLink href="/" size="lg" variant="accent">
                Return Home
              </ButtonLink>
              <ButtonLink href="/contact" size="lg" variant="ghost" className="text-ink-300">
                Contact support
              </ButtonLink>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
