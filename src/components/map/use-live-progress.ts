"use client";

import { useEffect, useState } from "react";
import {
  glideDurationMs,
  glideFraction,
  timeProgress,
  travelledProgress,
} from "@/lib/utils/progress";
import type { CargoOnRoute } from "./map-shared";

/**
 * How far along the route the package sits right now, 0 to 1, kept live.
 *
 * The same three things the Google map does, so a viewer without a Maps key
 * sees the identical journey:
 *
 *   1. The resting position is the honest one — distance covered since
 *      departure at the mode's real speed (60 km/h on land), and only while
 *      the status says it is actually moving.
 *   2. It glides up to that position once, because at a real 60 km/h the
 *      hour-to-hour creep is a fraction of a pixel and a parked marker reads
 *      as broken even when it is right.
 *   3. It then re-reads the clock every second so it carries on creeping,
 *      rather than freezing where the glide landed.
 *
 * A held shipment stops at the distance it had already covered — it never
 * snaps back to the origin, because `travelledProgress` stops accruing at
 * `heldSince` rather than resetting.
 */
export function useLiveCargoProgress(cargo: CargoOnRoute | null | undefined): number {
  /*
   * Depend on the journey's own values rather than the object, so a parent
   * re-render that hands over an equal-but-new `cargo` does not restart the
   * glide from zero.
   */
  const status = cargo?.status;
  const cargoType = cargo?.cargoType;
  const shipDate = cargo?.shipDate ?? null;
  const deliveryDate = cargo?.deliveryDate ?? null;
  const heldSince = cargo?.heldSince ?? null;
  const routeKm = cargo?.routeKm ?? 0;
  const moving = cargo?.moving ?? false;
  const fallback = cargo?.progress ?? 0;

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!status || !cargoType) return;

    const positionNow = () =>
      travelledProgress(status, shipDate, routeKm, cargoType, heldSince) ??
      timeProgress(shipDate, deliveryDate) ??
      fallback;

    let cancelled = false;
    let frame = 0;
    let tick: number | undefined;

    const destination = positionNow();

    /*
     * A held shipment is not travelling, so it must not be animated as though
     * it were. It takes up its covered distance directly — gliding it up from
     * the origin on every page load would show ground being covered that the
     * package is not covering, which is the opposite of standing still.
     */
    if (!moving) {
      frame = requestAnimationFrame(() => {
        if (!cancelled) setProgress(destination);
      });
      return () => {
        cancelled = true;
        cancelAnimationFrame(frame);
      };
    }

    const glideMs = glideDurationMs(cargoType, destination);
    const startedAt = performance.now();

    const step = (frameTime: number) => {
      if (cancelled) return;
      const t = Math.min((frameTime - startedAt) / glideMs, 1);
      setProgress(destination * glideFraction(t));

      if (t < 1) {
        frame = requestAnimationFrame(step);
        return;
      }

      // Arrived at "now". Only a moving shipment reaches here, and it carries
      // on creeping in real time rather than freezing where the glide landed.
      tick = window.setInterval(() => {
        if (cancelled) return;
        setProgress(positionNow());
      }, 1_000);
    };

    frame = requestAnimationFrame(step);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      if (tick !== undefined) window.clearInterval(tick);
    };
  }, [status, cargoType, shipDate, deliveryDate, heldSince, routeKm, moving, fallback]);

  return cargo ? progress : 0;
}
