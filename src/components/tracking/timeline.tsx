"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  BadgeCheck,
  Check,
  CircleDot,
  Clock3,
  MapPin,
  PackageCheck,
  PlaneTakeoff,
  ShieldAlert,
  Truck,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import type { ShipmentStatus, TrackingEvent } from "@/types";
import { STATUS_LABELS, formatDateShort, formatTime } from "@/lib/utils/format";
import { EASE } from "@/components/ui/motion";
import { cn } from "@/lib/utils/cn";

const ICONS: Record<ShipmentStatus, LucideIcon> = {
  pending: Clock3,
  picked_up: PackageCheck,
  in_transit: PlaneTakeoff,
  customs: Warehouse,
  out_for_delivery: Truck,
  delivered: BadgeCheck,
  delayed: ShieldAlert,
  exception: ShieldAlert,
};

interface TimelineProps {
  events: TrackingEvent[];
  className?: string;
}

/**
 * Vertical scan history, newest first. The most recent event is the "live" one;
 * everything below it is a completed milestone.
 */
export function TrackingTimeline({ events, className }: TimelineProps) {
  const reduce = useReducedMotion();

  if (events.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-ink-300 bg-ink-50 p-6 text-center text-sm text-ink-600">
        No tracking scans have been recorded for this shipment yet.
      </p>
    );
  }

  return (
    <ol className={cn("relative", className)}>
      {events.map((event, index) => {
        const Icon = ICONS[event.status] ?? CircleDot;
        const isLatest = index === 0;
        const isProblem = event.status === "delayed" || event.status === "exception";
        const isLast = index === events.length - 1;

        return (
          <motion.li
            key={event.id}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45, ease: EASE, delay: reduce ? 0 : Math.min(index, 6) * 0.06 }}
            className="relative flex gap-4 pb-7 last:pb-0 sm:gap-5"
          >
            {/* connector */}
            {!isLast ? (
              <span
                aria-hidden
                className={cn(
                  "absolute left-[1.1875rem] top-11 bottom-1 w-px sm:left-[1.375rem]",
                  isLatest ? "bg-linear-to-b from-brand-500 to-ink-200" : "bg-ink-200",
                )}
              />
            ) : null}

            <span
              aria-hidden
              className={cn(
                "relative z-10 mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-full border-2 sm:size-11",
                isProblem
                  ? "border-amber-200 bg-amber-50 text-amber-700"
                  : isLatest
                    ? "border-brand-600 bg-brand-600 text-white shadow-[0_0_0_5px_rgb(49_97_247/0.14)]"
                    : "border-ink-200 bg-white text-ink-500",
              )}
            >
              {isLatest || isProblem ? (
                <Icon className="size-4.5" />
              ) : (
                <Check className="size-4.5" />
              )}
            </span>

            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3
                  className={cn(
                    "text-[0.9375rem] font-bold sm:text-base",
                    isLatest ? "text-brand-900" : "text-ink-900",
                  )}
                >
                  {STATUS_LABELS[event.status]}
                </h3>
                {isLatest ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[0.6875rem] font-bold uppercase tracking-wide text-brand-800 ring-1 ring-inset ring-brand-200">
                    Latest
                  </span>
                ) : null}
              </div>

              <p className="mt-1 text-sm leading-relaxed text-ink-600">{event.description}</p>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-ink-500">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin aria-hidden className="size-3.5" />
                  {event.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 aria-hidden className="size-3.5" />
                  <time dateTime={event.event_date}>
                    {formatDateShort(event.event_date)} · {formatTime(event.event_date)}
                  </time>
                </span>
              </div>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
