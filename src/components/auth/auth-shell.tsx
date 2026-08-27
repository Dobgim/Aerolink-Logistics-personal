import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { BLUR_DATA_URL, IMAGES } from "@/lib/constants/images";

interface AuthShellProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
  aside?: { quote: string; attribution: string };
}

export function AuthShell({ title, description, children, footer, aside }: AuthShellProps) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
        <Logo />

        <main id="main" className="flex flex-1 items-center py-10">
          <div className="mx-auto w-full max-w-md">
            <h1 className="text-2xl font-extrabold text-ink-900 sm:text-3xl">{title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-ink-600 sm:text-base">{description}</p>

            <div className="mt-8">{children}</div>

            {footer ? <div className="mt-6 text-sm text-ink-600">{footer}</div> : null}
          </div>
        </main>

        <footer className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-500">
          <Link href="/" className="hover:text-ink-800">
            Back to site
          </Link>
          <Link href="/legal/privacy" className="hover:text-ink-800">
            Privacy
          </Link>
          <Link href="/legal/terms" className="hover:text-ink-800">
            Terms
          </Link>
        </footer>
      </div>

      <div className="relative hidden overflow-hidden bg-ink-950 lg:block">
        <Image
          src={IMAGES.airportCargo}
          alt="Air cargo containers being moved across an airport ramp"
          fill
          sizes="50vw"
          quality={70}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-ink-950 via-ink-950/70 to-ink-950/30" />

        <div className="absolute inset-x-0 bottom-0 p-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-brand-100 backdrop-blur">
            <ShieldCheck aria-hidden className="size-3.5" />
            Secure access
          </span>

          {aside ? (
            <blockquote className="mt-6 max-w-md">
              <p className="text-xl font-semibold leading-relaxed text-white">
                &ldquo;{aside.quote}&rdquo;
              </p>
              <footer className="mt-4 text-sm text-ink-400">{aside.attribution}</footer>
            </blockquote>
          ) : null}
        </div>
      </div>
    </div>
  );
}
