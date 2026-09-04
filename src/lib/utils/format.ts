import type {
  PackageType,
  ShipmentStatus,
  ShippingService,
  SupportStatus,
} from "@/types";

export const STATUS_LABELS: Record<ShipmentStatus, string> = {
  pending: "Pending",
  picked_up: "Picked Up",
  in_transit: "In Transit",
  customs: "Customs Clearance",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  delayed: "Delayed",
  exception: "Exception",
};

/**
 * What the customer reads on the scan a status change writes, when the admin
 * changes the status on the shipment itself rather than posting a scan by hand.
 */
export const STATUS_SCAN_DESCRIPTION: Record<ShipmentStatus, string> = {
  pending: "Shipment registered. Awaiting collection from the sender address.",
  picked_up: "Collected from the sender and received into the network.",
  in_transit: "In transit towards the destination.",
  customs: "Held at customs for clearance.",
  out_for_delivery: "Out for delivery with the local courier.",
  delivered: "Delivered to the receiver.",
  delayed: "Held. The shipment is stopped and is not currently moving.",
  exception: "Exception raised. The shipment is stopped pending resolution.",
};

export const STATUS_ORDER: ShipmentStatus[] = [
  "pending",
  "picked_up",
  "in_transit",
  "customs",
  "out_for_delivery",
  "delivered",
];

type Tone = "neutral" | "brand" | "accent" | "success" | "warning" | "danger";

export const STATUS_TONE: Record<ShipmentStatus, Tone> = {
  pending: "neutral",
  picked_up: "brand",
  in_transit: "brand",
  customs: "warning",
  out_for_delivery: "accent",
  delivered: "success",
  delayed: "warning",
  exception: "danger",
};

export const SERVICE_LABELS: Record<ShippingService, string> = {
  express_international: "Express International",
  standard_international: "Standard International",
  cargo_freight: "Cargo & Freight",
  ecommerce: "E-commerce Delivery",
  business_logistics: "Business Logistics",
  door_to_door: "Door-to-Door Delivery",
};

export const PACKAGE_LABELS: Record<PackageType, string> = {
  document: "Document",
  parcel: "Parcel",
  pallet: "Pallet",
  freight: "Freight",
  fragile: "Fragile Goods",
  perishable: "Perishable",
};

export const SUPPORT_STATUS_LABELS: Record<SupportStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

/**
 * All date formatting is pinned to UTC + en-GB-ish explicit parts so the server
 * render and the client render always agree (no hydration mismatch).
 */
const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const DATE_SHORT_FMT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const TIME_FMT = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "UTC",
});

export function formatDate(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return DATE_FMT.format(date);
}

export function formatDateShort(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return DATE_SHORT_FMT.format(date);
}

export function formatTime(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return `${TIME_FMT.format(date)} UTC`;
}

export function formatDateTime(value?: string | null): string {
  if (!value) return "—";
  return `${formatDateShort(value)} · ${formatTime(value)}`;
}

/** `2026-08-27T10:00:00Z` -> `2026-08-27T10:00` for datetime-local inputs. */
export function toInputDateTime(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 16);
}

/** `2026-09-02T17:00:00Z` -> `17:00` for a time input. */
export function toInputTime(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(11, 16);
}

export function toInputDate(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export function formatWeight(kg: number): string {
  return `${kg.toLocaleString("en-US", { maximumFractionDigits: 2 })} kg`;
}

/** `FCX-2026-938456` */
export function generateTrackingNumber(year = new Date().getUTCFullYear()): string {
  const digits = Math.floor(100000 + Math.random() * 900000);
  return `FCX-${year}-${digits}`;
}

/**
 * `ORD-2026-4837201` — the commercial order reference printed on the invoice.
 * Deliberately a different shape and length from the tracking number so the
 * two can never be mistaken for one another.
 */
export function generateOrderNumber(year = new Date().getUTCFullYear()): string {
  const digits = Math.floor(1_000_000 + Math.random() * 9_000_000);
  return `ORD-${year}-${digits}`;
}

/** Users paste `rpl 2026 938456`, `rpl2026938456`, etc. Normalise all of them. */
export function normalizeTrackingNumber(input: string): string {
  return input.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}
