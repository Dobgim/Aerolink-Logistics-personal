import { Flag, MapPin, Navigation, type LucideIcon } from "lucide-react";

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
