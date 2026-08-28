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
 * How long the marker takes to travel the *whole* route on screen, per mode.
 *
 * A real journey takes days, so the on-screen reveal is a compression of it —
 * but the modes stay in proportion, and none of them are quick. A truck
 * crossing the map should read as road haulage, not as a courier sprinting.
 */
const FULL_ROUTE_REVEAL_MS: Record<CargoType, number> = {
  plane: 11_000,
  motorbike: 16_000,
  car: 18_000,
  van: 19_000,
  package: 20_000,
  truck: 24_000,
  ship: 30_000,
};

/**
 * Time to animate the portion of the route actually covered. Scaling by the
 * distance keeps the speed constant: a shipment 10% along arrives on screen
 * quickly, one 90% along takes most of the full duration.
 */
export function revealDurationMs(cargoType: CargoType, progress: number): number {
  const full = FULL_ROUTE_REVEAL_MS[cargoType] ?? FULL_ROUTE_REVEAL_MS.package;
  return Math.max(full * Math.min(Math.max(progress, 0), 1), 1_500);
}
