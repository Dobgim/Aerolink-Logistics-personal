import { Flag, MapPin, Navigation, type LucideIcon } from "lucide-react";

import type { CargoType } from "@/types";
import { CARGO_ICONS } from "@/lib/utils/progress";

export interface MapPoint {
  kind: "origin" | "current" | "destination" | "hub";
  label: string;
  lat: number;
  lng: number;
}

/** One palette shared by every map provider so markers read identically. */
export const MARKER_COLORS: Record<MapPoint["kind"], string> = {
  origin: "#1c3fd8",
  current: "#fb5c11",
  destination: "#0f2166",
  hub: "#3161f7",
};

export const MARKER_LABELS: Record<MapPoint["kind"], string> = {
  origin: "Origin",
  current: "Current location",
  destination: "Destination",
  hub: "Service point",
};

export const MARKER_ICONS: Record<MapPoint["kind"], LucideIcon> = {
  origin: MapPin,
  current: Navigation,
  destination: Flag,
  hub: MapPin,
};

/**
 * Everything the map needs to draw the package itself: where along the route
 * it sits, whether it should be animating, and what to draw.
 */
export interface CargoOnRoute {
  /** 0 at the origin, 1 at the destination. */
  progress: number;
  moving: boolean;
  cargoType: CargoType;
  imageUrl: string | null;
  label: string;
}

/**
 * The DOM node that travels the route. An uploaded photo is used when there is
 * one; otherwise the vehicle glyph. Built as raw DOM because both map
 * providers take elements, not React nodes.
 */
export function cargoMarkerElement(cargo: CargoOnRoute): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.setAttribute("aria-label", cargo.label);
  wrapper.style.cssText = [
    "width:46px",
    "height:46px",
    "border-radius:9999px",
    "border:3px solid #ffffff",
    "background:#fb5c11",
    "box-shadow:0 4px 14px rgba(11,14,20,.45)",
    "display:flex",
    "align-items:center",
    "justify-content:center",
    "overflow:hidden",
    cargo.moving ? "animation:royalprime-pulse 2.4s ease-out infinite" : "",
  ]
    .filter(Boolean)
    .join(";");

  if (cargo.imageUrl) {
    const img = document.createElement("img");
    img.src = cargo.imageUrl;
    img.alt = "";
    img.style.cssText = "width:100%;height:100%;object-fit:cover;display:block";
    wrapper.appendChild(img);
  } else {
    wrapper.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none"
      stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
      >${CARGO_ICONS[cargo.cargoType]}</svg>`;
  }

  return wrapper;
}

/** Linear interpolation along an ordered list of points. */
export function pointAtProgress(
  points: { lat: number; lng: number }[],
  progress: number,
): { lat: number; lng: number } {
  if (points.length === 0) return { lat: 0, lng: 0 };
  if (points.length === 1) return points[0];

  const clamped = Math.min(Math.max(progress, 0), 1);
  const legs = points.length - 1;
  const scaled = clamped * legs;
  const index = Math.min(Math.floor(scaled), legs - 1);
  const t = scaled - index;

  const a = points[index];
  const b = points[index + 1];
  return {
    lat: a.lat + (b.lat - a.lat) * t,
    lng: a.lng + (b.lng - a.lng) * t,
  };
}
