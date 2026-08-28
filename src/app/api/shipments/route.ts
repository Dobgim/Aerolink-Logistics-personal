import type { NextRequest } from "next/server";
import {
  createShipment,
  isTrackingNumberTaken,
  listShipments,
  addTrackingEvent,
} from "@/lib/data/repository";
import { createShipmentSchema } from "@/lib/validations/schemas";
import { badRequest, handle, isResponse, ok, requireAdmin } from "@/lib/api/respond";
import { generateOrderNumber, generateTrackingNumber } from "@/lib/utils/format";
import { geocodeCity } from "@/lib/constants/geo";
import type { ShipmentStatus } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return handle(async () => {
    const auth = await requireAdmin();
    if (isResponse(auth)) return auth.response;

    const { searchParams } = new URL(request.url);
    const { rows, total } = await listShipments({
      status: (searchParams.get("status") as ShipmentStatus | "all") ?? "all",
      search: searchParams.get("search") ?? "",
      limit: Math.min(Number(searchParams.get("limit") ?? 25) || 25, 100),
      offset: Math.max(Number(searchParams.get("offset") ?? 0) || 0, 0),
    });

    return ok({ shipments: rows, total });
  });
}

export async function POST(request: NextRequest) {
  return handle(async () => {
    const auth = await requireAdmin();
    if (isResponse(auth)) return auth.response;

    const body = await request.json();
    const input = createShipmentSchema.parse(body);

    // Generate a tracking number when the admin leaves the field blank, and
    // retry on the (very unlikely) collision.
    let trackingNumber = input.tracking_number?.trim() || generateTrackingNumber();
    for (let attempt = 0; attempt < 5; attempt += 1) {
      if (!(await isTrackingNumberTaken(trackingNumber))) break;
      if (input.tracking_number) {
        return badRequest("That tracking number is already in use");
      }
      trackingNumber = generateTrackingNumber();
    }

    const coords =
      input.latitude != null && input.longitude != null
        ? { lat: input.latitude, lng: input.longitude }
        : geocodeCity(
            input.current_location?.split(",")[0] ?? input.origin_city,
            input.origin_country,
          );

    /*
     * The order number is a separate commercial reference from the tracking
     * number — different prefix and length, so the two can never be confused.
     */
    const orderNumber = input.order_number?.trim() || generateOrderNumber();

    const shipment = await createShipment({
      tracking_number: trackingNumber,
      order_number: orderNumber,

      sender_name: input.sender_name,
      sender_company: input.sender_company ?? null,
      sender_email: input.sender_email ?? null,
      sender_phone: input.sender_phone ?? null,
      sender_city: input.sender_city ?? input.origin_city,
      sender_state: input.sender_state ?? null,
      sender_country: input.sender_country ?? input.origin_country,

      receiver_name: input.receiver_name,
      receiver_company: input.receiver_company ?? null,
      receiver_email: input.receiver_email ?? null,
      receiver_phone: input.receiver_phone ?? null,
      receiver_city: input.receiver_city ?? input.destination_city,
      receiver_state: input.receiver_state ?? null,
      receiver_country: input.receiver_country ?? input.destination_country,

      origin_country: input.origin_country,
      origin_city: input.origin_city,
      destination_country: input.destination_country,
      destination_city: input.destination_city,
      package_type: input.package_type,
      weight: input.weight,
      packages: input.packages,
      shipping_service: input.shipping_service,
      goods_description: input.goods_description ?? null,
      cargo_image_url: input.cargo_image_url ?? null,
      cargo_type: input.cargo_type,
      ship_date: input.ship_date ?? null,

      currency: input.currency,
      declared_value: input.declared_value,
      amount_due: input.amount_due,
      payment_description: input.payment_description ?? null,
      payment_status: input.payment_status,

      status: input.status,
      current_location:
        input.current_location ?? `${input.origin_city}, ${input.origin_country}`,
      latitude: coords?.lat ?? null,
      longitude: coords?.lng ?? null,
      estimated_delivery: input.estimated_delivery,
    });

    // Every shipment starts with a scan so the customer timeline is never empty.
    await addTrackingEvent({
      shipment_id: shipment.id,
      status: shipment.status,
      location: shipment.current_location ?? `${input.origin_city}, ${input.origin_country}`,
      latitude: coords?.lat ?? null,
      longitude: coords?.lng ?? null,
      description:
        shipment.status === "pending"
          ? "Shipment created. Awaiting pickup from the sender address."
          : "Shipment created and entered into the Royal Prime network.",
      event_date: new Date().toISOString(),
    });

    return ok({ shipment }, 201);
  });
}
