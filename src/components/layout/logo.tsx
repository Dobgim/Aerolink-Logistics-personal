import Link from "next/link";
import { cn } from "@/lib/utils/cn";

/**
 * Original AeroLink mark: a departing flight path that breaks through a
 * tracking node. Drawn from scratch — no third-party brand assets involved.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      role="img"
      aria-label="AeroLink Logistics"
      className={cn("size-9 shrink-0", className)}
    >
      <defs>
        <linearGradient id="al-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3161f7" />
          <stop offset="55%" stopColor="#1c3fd8" />
          <stop offset="100%" stopColor="#0f2166" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#al-mark)" />
      {/* flight path */}
      <path
        d="M8.5 25.5c5.2-1.4 9.6-4.2 13.2-8.4"
        stroke="#ffffff"
        strokeOpacity="0.45"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="0.5 4"
        fill="none"
      />
      {/* wing / arrow */}
      <path
        d="M13.8 27.4 31.6 9.9c.9-.9 2.4-.1 2.2 1.1l-3 17.4c-.2 1.1-1.5 1.5-2.3.8l-5.2-4.6-4.9 4.1c-.7.6-1.8.5-2.4-.2-.6-.7-.5-1.7.2-2.3z"
        fill="#ffffff"
      />
      {/* tracking node */}
      <circle cx="24.4" cy="24.6" r="2.6" fill="#fb5c11" />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  tone?: "dark" | "light";
  showWordmark?: boolean;
  href?: string;
}

export function Logo({ className, tone = "dark", showWordmark = true, href = "/" }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-lg transition-opacity hover:opacity-90",
        className,
      )}
      aria-label="AeroLink Logistics — home"
    >
      <LogoMark />
      {showWordmark ? (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-display text-[1.0625rem] font-extrabold tracking-[-0.03em] sm:text-lg",
              tone === "dark" ? "text-ink-900" : "text-white",
            )}
          >
            Aero<span className={tone === "dark" ? "text-brand-700" : "text-brand-200"}>Link</span>
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
      ) : null}
    </Link>
  );
}
