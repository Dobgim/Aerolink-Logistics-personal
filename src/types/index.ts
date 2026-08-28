export type UserRole = "admin" | "customer";

export type ShipmentStatus =
  | "pending"
  | "picked_up"
  | "in_transit"
  | "customs"
  | "out_for_delivery"
  | "delivered"
  | "delayed"
  | "exception";

export type PackageType =
  | "document"
  | "parcel"
  | "pallet"
  | "freight"
  | "fragile"
  | "perishable";

export type ShippingService =
  | "express_international"
  | "standard_international"
  | "cargo_freight"
  | "ecommerce"
  | "business_logistics"
  | "door_to_door";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  created_at: string;
}

/** A party on the waybill — the sender or the receiver. */
export interface PartyDetails {
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postcode: string | null;
  country: string | null;
}

export type PaymentStatus = "unpaid" | "paid" | "refunded";

export interface Shipment {
  id: string;
  /** Scan-level tracking reference shown to the public: RPL-YYYY-NNNNNN. */
  tracking_number: string;
  /** Commercial order reference printed on the invoice: ORD-YYYY-NNNNNNN. */
  order_number: string;

  sender_name: string;
  sender_company: string | null;
  sender_email: string | null;
  sender_phone: string | null;
  sender_address: string | null;
  sender_city: string | null;
  sender_state: string | null;
  sender_postcode: string | null;
  sender_country: string | null;

  receiver_name: string;
  receiver_company: string | null;
  receiver_email: string | null;
  receiver_phone: string | null;
  receiver_address: string | null;
  receiver_city: string | null;
  receiver_state: string | null;
  receiver_postcode: string | null;
  receiver_country: string | null;

  origin_country: string;
  origin_city: string;
  destination_country: string;
  destination_city: string;
  package_type: PackageType;
  weight: number;
  packages: number;
  shipping_service: ShippingService;
  goods_description: string | null;

  /* Commercial totals, all in `currency`. */
  currency: string;
  declared_value: number;
  freight_cost: number;
  insurance_cost: number;
  tax_amount: number;
  payment_status: PaymentStatus;

  status: ShipmentStatus;
  current_location: string | null;
  latitude: number | null;
  longitude: number | null;
  estimated_delivery: string | null;
  created_at: string;
  updated_at: string;
}

export interface TrackingEvent {
  id: string;
  shipment_id: string;
  status: ShipmentStatus;
  location: string;
  latitude: number | null;
  longitude: number | null;
  description: string;
  event_date: string;
  created_at: string;
}

export interface ShipmentWithEvents extends Shipment {
  tracking_events: TrackingEvent[];
}

export interface ServiceLocation {
  id: string;
  country: string;
  city: string;
  town: string | null;
  latitude: number;
  longitude: number;
  address: string;
  available_services: ShippingService[];
}

export type SupportStatus = "open" | "in_progress" | "resolved" | "closed";

export interface SupportRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  tracking_number: string | null;
  subject: string;
  message: string;
  status: SupportStatus;
  created_at: string;
}

export interface DashboardStats {
  total: number;
  in_transit: number;
  delivered: number;
  pending: number;
  delayed: number;
  customers: number;
  open_support: number;
  by_month: { month: string; created: number; delivered: number }[];
  by_status: { status: ShipmentStatus; count: number }[];
}

export type ApiError = { error: string; details?: unknown };
