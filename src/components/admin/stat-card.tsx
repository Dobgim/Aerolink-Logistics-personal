import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StatCardProps {
  label: string;
  value: number | string;
  Icon: LucideIcon;
  tone?: "brand" | "accent" | "success" | "warning" | "neutral";
  hint?: string;
  href?: string;
}

const TONES = {
  brand: "bg-brand-50 text-brand-700",
  accent: "bg-accent-50 text-accent-700",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  neutral: "bg-ink-100 text-ink-600",
} as const;

export function StatCard({ label, value, Icon, tone = "brand", hint, href }: StatCardProps) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-ink-600">{label}</p>
        <span className={cn("inline-flex size-9 items-center justify-center rounded-lg", TONES[tone])}>
          <Icon aria-hidden className="size-4.5" />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-extrabold tracking-[-0.03em] text-ink-900">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-ink-500">{hint}</p> : null}
    </>
  );

  const className =
    "block rounded-2xl border border-ink-200 bg-white p-5 shadow-card transition-[transform,box-shadow] duration-300";

  return href ? (
    <Link href={href} className={cn(className, "hover:-translate-y-0.5 hover:shadow-lift")}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}
