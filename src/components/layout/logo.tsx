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

/**
 * The FreightCargoXpress mark: motion lines running into a forward chevron,
 * with the accent chevron carrying the "Xpress". Drawn rather than raster so
 * it stays crisp from a 16px favicon up to the footer lockup.
 *
 * Kept in step with `public/icon.svg`, which is the same artwork.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      role="img"
      aria-label="FreightCargoXpress"
      className={cn("size-9 shrink-0", className)}
    >
      <defs>
        <linearGradient id="fcx-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3161f7" />
          <stop offset="55%" stopColor="#1c3fd8" />
          <stop offset="100%" stopColor="#0f2166" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#fcx-mark)" />
      <g stroke="#ffffff" strokeOpacity="0.38" strokeWidth="2" strokeLinecap="round">
        <path d="M7 14h6" />
        <path d="M5.5 20h5" />
        <path d="M7 26h6" />
      </g>
      <path
        d="M16.5 11.5 25 20l-8.5 8.5"
        fill="none"
        stroke="#ffffff"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26 14.5 31.5 20 26 25.5"
        fill="none"
        stroke="#fb5c11"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
    /*
      One line, so the name carries the lockup on its own. It is nearly twice
      the length of a short wordmark, so it is tracked tighter and steps up only
      from `sm` to keep it inside a phone's header without wrapping.
    */
    <span
      className={cn(
        "font-display text-base font-extrabold leading-none tracking-[-0.035em] sm:text-lg",
        tone === "dark" ? "text-ink-900" : "text-white",
      )}
    >
      FreightCargo
      <span className={tone === "dark" ? "text-brand-700" : "text-brand-200"}>Xpress</span>
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
