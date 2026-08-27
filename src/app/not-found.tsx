import Link from "next/link";
import { Compass, PackageSearch } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/primitives";

export const metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

const SUGGESTIONS = [
  { label: "Track a shipment", href: "/tracking" },
  { label: "Shipping services", href: "/services" },
  { label: "Find a service point", href: "/locations" },
  { label: "Contact support", href: "/contact" },
];

export default function NotFound() {
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
            <span className="inline-flex size-16 items-center justify-center rounded-2xl bg-white/10 text-brand-200">
              <Compass aria-hidden className="size-8" />
            </span>

            <p className="mt-8 font-display text-6xl font-extrabold text-white/15 sm:text-7xl">
              404
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">Page Not Found</h1>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-ink-300">
              The page you were looking for has moved or never existed. Your shipments are exactly
              where they should be.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href="/" size="lg" variant="light">
                Return Home
              </ButtonLink>
              <ButtonLink
                href="/tracking"
                size="lg"
                variant="accent"
                icon={<PackageSearch aria-hidden className="size-4" />}
              >
                Track a shipment
              </ButtonLink>
            </div>

            <nav aria-label="Suggested pages" className="mt-12 border-t border-white/10 pt-8">
              <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                {SUGGESTIONS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm font-semibold text-ink-400 underline-offset-4 transition-colors hover:text-white hover:underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </Container>
      </main>
    </div>
  );
}
