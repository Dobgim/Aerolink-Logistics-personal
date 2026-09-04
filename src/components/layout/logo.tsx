"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Drop the brand artwork at `public/brand/royal-prime-logo.png` and it is used
 * automatically — `next.config.ts` checks for the file at build time and sets
 * these variables. Until the files exist the drawn mark below stands in, so
 * nothing 404s on every page load.
 */
const LOGO_FILE = process.env.NEXT_PUBLIC_BRAND_LOGO ?? "";
const EMBLEM_FILE = process.env.NEXT_PUBLIC_BRAND_EMBLEM ?? "";

/** Fallback mark: a departing flight path breaking through a tracking node. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      role="img"
      aria-label="FreightCargoXpress"
      className={cn("size-9 shrink-0", className)}
    >
      <defs>
        <linearGradient id="rp-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3161f7" />
          <stop offset="55%" stopColor="#1c3fd8" />
          <stop offset="100%" stopColor="#0f2166" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#rp-mark)" />
      <path
        d="M8.5 25.5c5.2-1.4 9.6-4.2 13.2-8.4"
        stroke="#ffffff"
        strokeOpacity="0.45"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="0.5 4"
        fill="none"
      />
      <path
        d="M13.8 27.4 31.6 9.9c.9-.9 2.4-.1 2.2 1.1l-3 17.4c-.2 1.1-1.5 1.5-2.3.8l-5.2-4.6-4.9 4.1c-.7.6-1.8.5-2.4-.2-.6-.7-.5-1.7.2-2.3z"
        fill="#ffffff"
      />
      <circle cx="24.4" cy="24.6" r="2.6" fill="#fb5c11" />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  tone?: "dark" | "light";
  showWordmark?: boolean;
  href?: string;
  /** The header uses the compact lockup; the footer can afford a larger mark. */
  size?: "sm" | "lg";
}

function Wordmark({ tone }: { tone: "dark" | "light" }) {
  return (
    <span className="flex flex-col leading-none">
      <span
        className={cn(
          "font-display text-[1.0625rem] font-extrabold tracking-[-0.03em] sm:text-lg",
          tone === "dark" ? "text-ink-900" : "text-white",
        )}
      >
        Royal
        <span className={tone === "dark" ? "text-brand-700" : "text-brand-200"}>Prime</span>
      </span>
      <span
        className={cn(
          "mt-0.5 text-[0.6875rem] font-bold uppercase tracking-[0.2em]",
          tone === "dark" ? "text-ink-500" : "text-brand-200/80",
        )}
      >
        Logistics
      </span>
    </span>
  );
}

export function Logo({
  className,
  tone = "dark",
  showWordmark = true,
  href = "/",
  size = "sm",
}: LogoProps) {
  /*
   * A raster logo can still fail to arrive on a flaky mobile connection, and a
   * browser will not retry it — it just leaves a broken-image icon in the
   * layout. If that happens we fall back to the drawn mark and the typeset
   * name, so the brand always renders as something.
   */
  const [artworkFailed, setArtworkFailed] = useState(false);

  const isFooter = size === "lg";
  const useFullLockup = Boolean(LOGO_FILE) && isFooter && !artworkFailed;
  const useEmblem = Boolean(EMBLEM_FILE) && !isFooter && !artworkFailed;
  const useDrawnMark = !useFullLockup && !useEmblem;

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-lg transition-opacity hover:opacity-90",
        className,
      )}
      aria-label="FreightCargoXpress — home"
    >
      {useFullLockup ? (
        /*
         * The full stacked lockup, on a light plate. The artwork is
         * navy-and-gold on transparency, so on a dark surface the navy
         * lettering would otherwise disappear.
         */
        <span
          className={cn(
            "inline-flex shrink-0 items-center justify-center",
            tone === "light" && "rounded-xl bg-white/95 p-2.5 shadow-sm",
          )}
        >
          <Image
            src={LOGO_FILE}
            alt="FreightCargoXpress"
            width={288}
            height={288}
            /*
             * The footer sits below the fold, so this loads lazily and is not
             * preloaded. Marking it `priority` had a phone fetching it in
             * competition with the hero.
             */
            loading="lazy"
            unoptimized
            onError={() => setArtworkFailed(true)}
            className="h-24 w-auto object-contain sm:h-28"
          />
        </span>
      ) : null}

      {useEmblem ? (
        /*
         * A header is horizontal, so the stacked lockup is split: the emblem
         * carries the mark and the name is typeset beside it. Shrinking the
         * whole lockup to nav height would render its wordmark unreadable.
         */
        <Image
          src={EMBLEM_FILE}
          alt=""
          width={64}
          height={64}
          priority
          unoptimized
          onError={() => setArtworkFailed(true)}
          className="size-10 shrink-0 object-contain sm:size-11"
        />
      ) : null}

      {useDrawnMark ? <LogoMark className={isFooter ? "size-16" : "size-9"} /> : null}

      {/* The full lockup already contains the name; everything else needs it. */}
      {showWordmark && !useFullLockup ? <Wordmark tone={tone} /> : null}
    </Link>
  );
}
