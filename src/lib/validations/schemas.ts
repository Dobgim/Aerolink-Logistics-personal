import { z } from "zod";

export const shipmentStatusSchema = z.enum([
  "pending",
  "picked_up",
  "in_transit",
  "customs",
  "out_for_delivery",
  "delivered",
  "delayed",
  "exception",
]);

export const packageTypeSchema = z.enum([
  "document",
  "parcel",
  "pallet",
  "freight",
  "fragile",
  "perishable",
]);

export const shippingServiceSchema = z.enum([
  "express_international",
  "standard_international",
  "cargo_freight",
  "ecommerce",
  "business_logistics",
  "door_to_door",
]);

export const supportStatusSchema = z.enum(["open", "in_progress", "resolved", "closed"]);

const optionalEmail = z
  .string()
  .trim()
  .email("Enter a valid email address")
  .or(z.literal(""))
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .optional();

const optionalText = z
  .string()
  .trim()
  .max(120)
  .or(z.literal(""))
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .optional();

const optionalLongText = z
  .string()
  .trim()
  .max(400)
  .or(z.literal(""))
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .optional();

const latitude = z.coerce.number().min(-90).max(90).nullable().optional();
const longitude = z.coerce.number().min(-180).max(180).nullable().optional();

export const paymentStatusSchema = z.enum(["unpaid", "paid", "refunded"]);

const money = z.coerce.number().min(0).max(10_000_000).default(0);

export const createShipmentSchema = z.object({
  tracking_number: z
    .string()
    .trim()
    .min(6, "Tracking number is too short")
    .max(32)
    .optional()
    .or(z.literal("")),
  order_number: z.string().trim().min(6).max(32).optional().or(z.literal("")),

  sender_name: z.string().trim().min(2, "Sender name is required").max(120),
  sender_company: optionalText,
  sender_email: optionalEmail,
  sender_phone: optionalText,
  sender_address: optionalLongText,
  sender_city: optionalText,
  sender_state: optionalText,
  sender_postcode: optionalText,
  sender_country: optionalText,

  receiver_name: z.string().trim().min(2, "Receiver name is required").max(120),
  receiver_company: optionalText,
  receiver_email: optionalEmail,
  receiver_phone: optionalText,
  receiver_address: optionalLongText,
  receiver_city: optionalText,
  receiver_state: optionalText,
  receiver_postcode: optionalText,
  receiver_country: optionalText,
  origin_country: z.string().trim().min(2, "Origin country is required").max(80),
  origin_city: z.string().trim().min(2, "Origin city is required").max(80),
  destination_country: z.string().trim().min(2, "Destination country is required").max(80),
  destination_city: z.string().trim().min(2, "Destination city is required").max(80),
  package_type: packageTypeSchema,
  weight: z.coerce.number().min(0.01, "Weight must be greater than zero").max(100_000),
  packages: z.coerce.number().int().min(1, "At least one package").max(10_000),
  shipping_service: shippingServiceSchema,
  goods_description: optionalLongText,

  currency: z.string().trim().length(3, "Use a 3-letter currency code").default("USD"),
  declared_value: money,
  freight_cost: money,
  insurance_cost: money,
  tax_amount: money,
  payment_status: paymentStatusSchema.default("unpaid"),

  status: shipmentStatusSchema.default("pending"),
  current_location: optionalText,
  latitude,
  longitude,
  estimated_delivery: z
    .string()
    .trim()
    .min(1, "Estimated delivery is required")
    .transform((v) => new Date(v).toISOString()),
});

export const updateShipmentSchema = createShipmentSchema.partial().extend({
  tracking_number: z.string().trim().min(6).max(32).optional(),
});

export const trackingEventSchema = z.object({
  shipment_id: z.string().trim().min(1, "Shipment is required"),
  status: shipmentStatusSchema,
  location: z.string().trim().min(2, "Location is required").max(160),
  latitude,
  longitude,
  description: z.string().trim().min(4, "Add a short description").max(400),
  event_date: z
    .string()
    .trim()
    .min(1, "Event date is required")
    .transform((v) => new Date(v).toISOString()),
  /** When true the parent shipment's status + location are advanced to match. */
  sync_shipment: z.boolean().default(true),
});

export const supportRequestSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name").max(120),
  email: z.string().trim().email("Enter a valid email address"),
  phone: optionalText,
  tracking_number: optionalText,
  subject: z.string().trim().min(3, "Add a subject").max(160),
  message: z.string().trim().min(10, "Please add a few more details").max(4000),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = loginSchema.extend({
  name: z.string().trim().min(2, "Please enter your full name").max(120),
  phone: optionalText,
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
});

export type CreateShipmentInput = z.infer<typeof createShipmentSchema>;
export type UpdateShipmentInput = z.infer<typeof updateShipmentSchema>;
export type TrackingEventInput = z.infer<typeof trackingEventSchema>;
export type SupportRequestInput = z.infer<typeof supportRequestSchema>;

/** Turns a ZodError into `{ field: message }` for inline form errors. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
