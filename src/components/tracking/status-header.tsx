import { ArrowRight, CalendarClock, Navigation } from "lucide-react";
import type { Shipment } from "@/types";
import { Badge } from "@/components/ui/primitives";
import { STATUS_LABELS, STATUS_ORDER, formatDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export function StatusHeader({ shipment }: { shipment: Shipment }) {
  const stepIndex = STATUS_ORDER.indexOf(shipment.status);
  const progress =
    shipment.status === "delivered"
      ? 100
      : stepIndex >= 0
        ? ((stepIndex + 0.5) / STATUS_ORDER.length) * 100
        : 42;

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card">
      <div className="border-b border-ink-200 bg-linear-to-r from-brand-900 to-brand-700 px-5 py-5 text-white sm:px-7 sm:py-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-200">
              Shipment status
            </p>
            <h2 className="mt-1.5 text-2xl font-extrabold text-white sm:text-3xl">
              {STATUS_LABELS[shipment.status]}
            </h2>
            <p className="mt-1.5 font-mono text-sm text-brand-100">
              {shipment.tracking_number}
            </p>
          </div>

          <Badge tone="invert" dot className="mt-1 shrink-0">
            {shipment.status === "delivered" ? "Completed" : "Live tracking"}
          </Badge>
        </div>

        <div className="mt-6">
          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-white/20"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Delivery progress"
          >
            <div
              className={cn(
                "h-full rounded-full transition-[width] duration-700",
                shipment.status === "delivered" ? "bg-emerald-400" : "bg-accent-400",
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
          <ol className="mt-2.5 hidden justify-between text-[0.6875rem] font-semibold text-brand-100 sm:flex">
            {STATUS_ORDER.map((status, i) => (
              <li key={status} className={cn(i <= stepIndex ? "text-white" : "opacity-60")}>
                {STATUS_LABELS[status]}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <dl className="grid gap-x-6 gap-y-5 px-5 py-5 sm:grid-cols-2 sm:px-7 sm:py-6 lg:grid-cols-4">
        <div>
          <dt className="text-xs font-bold uppercase tracking-[0.08em] text-ink-500">Origin</dt>
          <dd className="mt-1 flex items-center gap-2 text-[0.9375rem] font-semibold text-ink-900">
            {shipment.origin_city}, {shipment.origin_country}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-[0.08em] text-ink-500">
            Destination
          </dt>
          <dd className="mt-1 flex items-center gap-2 text-[0.9375rem] font-semibold text-ink-900">
            <ArrowRight aria-hidden className="size-4 shrink-0 text-ink-400 sm:hidden lg:inline" />
            {shipment.destination_city}, {shipment.destination_country}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-[0.08em] text-ink-500">
            Estimated delivery
          </dt>
          <dd className="mt-1 flex items-center gap-2 text-[0.9375rem] font-semibold text-ink-900">
            <CalendarClock aria-hidden className="size-4 shrink-0 text-ink-400" />
            {formatDate(shipment.estimated_delivery)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-[0.08em] text-ink-500">
            Current location
          </dt>
          <dd className="mt-1 flex items-center gap-2 text-[0.9375rem] font-semibold text-ink-900">
            <Navigation aria-hidden className="size-4 shrink-0 text-accent-600" />
            {shipment.current_location ?? "Awaiting first scan"}
          </dd>
        </div>
      </dl>
    </div>
  );
}
