import type { ComponentProps, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/* ---------------------------------------------------------------- */
/* Layout                                                            */
/* ---------------------------------------------------------------- */

export function Container({ className, children, ...rest }: ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[85rem] px-4 sm:px-6 lg:px-8", className)}
      {...rest}
    >
      {children}
    </div>
  );
}

interface SectionProps extends ComponentProps<"section"> {
  as?: ElementType;
  tone?: "white" | "muted" | "dark" | "brand";
}

const SECTION_TONES = {
  white: "bg-white",
  muted: "bg-ink-50",
  dark: "bg-ink-950 text-ink-200",
  brand: "bg-brand-900 text-brand-100",
} as const;

export function Section({ className, tone = "white", children, ...rest }: SectionProps) {
  return (
    <section
      className={cn("py-16 sm:py-20 lg:py-24", SECTION_TONES[tone], className)}
      {...rest}
    >
      {children}
    </section>
  );
}

/* ---------------------------------------------------------------- */
/* Typography                                                        */
/* ---------------------------------------------------------------- */

interface EyebrowProps {
  children: ReactNode;
  className?: string;
  tone?: "brand" | "light";
}

export function Eyebrow({ children, className, tone = "brand" }: EyebrowProps) {
  return (
    <p
      className={cn(
        "text-xs font-bold uppercase tracking-[0.16em]",
        tone === "brand" ? "text-brand-700" : "text-brand-200",
        className,
      )}
    >
      {children}
    </p>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
  action?: ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
  className,
  action,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
        {eyebrow ? (
          <Eyebrow tone={tone === "dark" ? "brand" : "light"} className="mb-3">
            {eyebrow}
          </Eyebrow>
        ) : null}
        <h2
          className={cn(
            "text-3xl font-extrabold leading-[1.1] sm:text-4xl lg:text-[2.75rem]",
            tone === "light" && "text-white",
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "mt-4 text-base leading-relaxed sm:text-lg",
              tone === "dark" ? "text-ink-600" : "text-ink-300",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Surfaces                                                          */
/* ---------------------------------------------------------------- */

const CARD_TONES = {
  default: "border-ink-200/80 bg-white",
  brand: "border-brand-800 bg-brand-900 text-brand-100",
  muted: "border-ink-200 bg-ink-50",
  info: "border-brand-200 bg-brand-50",
  warning: "border-red-200 bg-red-50/60",
} as const;

interface CardProps extends ComponentProps<"div"> {
  interactive?: boolean;
  padded?: boolean;
  /**
   * Use this rather than passing a background through `className` — competing
   * background utilities resolve by stylesheet order, not prop order.
   */
  tone?: keyof typeof CARD_TONES;
}

export function Card({
  className,
  interactive,
  padded = true,
  tone = "default",
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border shadow-card",
        CARD_TONES[tone],
        padded && "p-5 sm:p-6",
        interactive &&
          "transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift motion-reduce:hover:translate-y-0",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Badge                                                             */
/* ---------------------------------------------------------------- */

export type BadgeTone =
  | "neutral"
  | "brand"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "invert";

const BADGE_TONES: Record<BadgeTone, string> = {
  neutral: "bg-ink-100 text-ink-700 ring-ink-200",
  brand: "bg-brand-50 text-brand-800 ring-brand-200",
  accent: "bg-accent-50 text-accent-800 ring-accent-200",
  success: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  warning: "bg-amber-50 text-amber-800 ring-amber-200",
  danger: "bg-red-50 text-red-800 ring-red-200",
  invert: "bg-white/12 text-white ring-white/25",
};

interface BadgeProps extends ComponentProps<"span"> {
  tone?: BadgeTone;
  dot?: boolean;
}

export function Badge({ tone = "neutral", dot, className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        BADGE_TONES[tone],
        className,
      )}
      {...rest}
    >
      {dot ? <span aria-hidden className="size-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}

/* ---------------------------------------------------------------- */
/* Skeleton                                                          */
/* ---------------------------------------------------------------- */

export function Skeleton({ className, ...rest }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-lg bg-ink-200/70", className)}
      {...rest}
    />
  );
}

/* ---------------------------------------------------------------- */
/* Definition list used across shipment/detail views                 */
/* ---------------------------------------------------------------- */

interface DataItemProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function DataItem({ label, value, icon, className }: DataItemProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <dt className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.08em] text-ink-500">
        {icon}
        {label}
      </dt>
      <dd className="text-[0.9375rem] font-semibold text-ink-900 break-words">{value}</dd>
    </div>
  );
}
