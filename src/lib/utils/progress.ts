import type { CargoType, ShipmentStatus } from "@/types";

/**
 * How far along the origin -> destination route a shipment sits, 0 to 1.
 *
 * A real position would come from the last scan's coordinates; this is the
 * fallback the map uses to place the package when a status has no coordinates
 * of its own, so a held shipment still shows the distance it has covered
 * rather than snapping back to the origin.
 */
export const STATUS_PROGRESS: Record<ShipmentStatus, number> = {
  pending: 0,
  picked_up: 0.08,
  in_transit: 0.55,
  customs: 0.78,
  out_for_delivery: 0.92,
  delivered: 1,
  delayed: 0.55,
  exception: 0.5,
};

/**
 * Whether the package should animate along the route.
 *
 * Anything held — pending, delayed, in customs, or an exception — stops where
 * it is rather than drifting, because movement would misrepresent the state.
 */
export function isMoving(status: ShipmentStatus): boolean {
  return status === "picked_up" || status === "in_transit" || status === "out_for_delivery";
}

export function progressFor(status: ShipmentStatus): number {
  return STATUS_PROGRESS[status] ?? 0;
}

export const CARGO_LABELS: Record<CargoType, string> = {
  package: "Package",
  car: "Car",
  van: "Delivery van",
  truck: "Truck",
  motorbike: "Motorbike",
  plane: "Air freight",
  ship: "Sea freight",
};

/**
 * Inline SVG for each cargo type, sized to fit a map marker. Kept as raw
 * markup because map markers are built from DOM nodes, not React elements.
 */
export const CARGO_ICONS: Record<CargoType, string> = {
  package:
    '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5"/><path d="M12 13v8"/>',
  car: '<path d="M5 17H3v-5l2-5h14l2 5v5h-2"/><circle cx="7.5" cy="17" r="2"/><circle cx="16.5" cy="17" r="2"/><path d="M9.5 17h5"/>',
  van: '<path d="M3 17V7h11v10"/><path d="M14 10h4l3 3v4h-2"/><circle cx="7" cy="17.5" r="2"/><circle cx="17" cy="17.5" r="2"/>',
  truck: '<path d="M2 16V6h12v10"/><path d="M14 9h4l4 4v3h-2"/><circle cx="6" cy="17" r="2"/><circle cx="18" cy="17" r="2"/>',
  motorbike:
    '<circle cx="5.5" cy="17" r="3"/><circle cx="18.5" cy="17" r="3"/><path d="M8.5 17h6l-3-6h4l2-3"/>',
  plane:
    '<path d="M17.8 19.2 16 11l3.5-3.5a2.1 2.1 0 0 0-3-3L13 8 4.8 6.2a1 1 0 0 0-1 1.6L9 11l-2 3H4l1 3 3 1 1-3 3-2 3.2 5.2a1 1 0 0 0 1.6-1z"/>',
  ship: '<path d="M3 17c1.5 1 3 1 4.5 0S10.5 16 12 17s3 1 4.5 0S19.5 16 21 17"/><path d="M4 13V8h16v5"/><path d="M12 4v4"/><path d="m5 13 7-3 7 3"/>',
};

/**
 * How far along the route the shipment is by the clock, 0 to 1.
 *
 * This is the honest position: a shipment that left on the 24th and is due on
 * the 3rd is genuinely a third of the way there on the 27th, and creeps
 * forward on its own as the days pass. Status only decides whether it is
 * moving; the calendar decides where it is.
 *
 * Returns null when the journey has no dates to measure between, so the caller
 * can fall back to the status-derived position.
 */
export function timeProgress(
  shipDate: string | null | undefined,
  deliveryDate: string | null | undefined,
  now: number = Date.now(),
): number | null {
  if (!shipDate || !deliveryDate) return null;

  const start = new Date(shipDate).getTime();
  const end = new Date(deliveryDate).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return null;

  return Math.min(Math.max((now - start) / (end - start), 0), 1);
}

/**
 * How fast each mode actually travels, in km/h.
 *
 * Road haulage runs at 60 km/h — a lorry's realistic average once stops,
 * traffic and driver hours are folded in, not its top speed. Sea freight is a
 * container ship's ~20 knots; air is a loaded freighter's cruise.
 */
export const MODE_SPEED_KMH: Record<CargoType, number> = {
  car: 60,
  van: 60,
  truck: 60,
  motorbike: 60,
  package: 60,
  plane: 800,
  ship: 37,
};

export function speedKmhFor(cargoType: CargoType): number {
  return MODE_SPEED_KMH[cargoType] ?? MODE_SPEED_KMH.package;
}

const EARTH_RADIUS_KM = 6371;

/** Great-circle distance between two points, in kilometres. */
export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Length of the whole drawn route, following every leg rather than cutting
 * straight from origin to destination.
 */
export function routeLengthKm(points: { lat: number; lng: number }[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) total += haversineKm(points[i - 1], points[i]);
  return total;
}

/**
 * Where the shipment has genuinely got to: distance covered at its mode's real
 * speed since it shipped, as a fraction of the route.
 *
 * A 5,500 km run at 60 km/h takes about 92 hours, so on screen the marker
 * barely creeps — which is the point. It is moving at the speed the thing
 * actually moves, not at a speed chosen to look like motion.
 *
 * Returns null when there is nothing to measure, so the caller can fall back.
 */
export function distanceProgress(
  shipDate: string | null | undefined,
  routeKm: number,
  cargoType: CargoType,
  now: number = Date.now(),
): number | null {
  if (!shipDate || !(routeKm > 0)) return null;

  const start = new Date(shipDate).getTime();
  if (Number.isNaN(start)) return null;

  const hoursElapsed = (now - start) / 3_600_000;
  if (hoursElapsed <= 0) return 0;

  const kmCovered = hoursElapsed * speedKmhFor(cargoType);
  return Math.min(kmCovered / routeKm, 1);
}

/** Hours the route takes at the mode's real speed. */
export function travelHours(routeKm: number, cargoType: CargoType): number {
  return routeKm / speedKmhFor(cargoType);
}
