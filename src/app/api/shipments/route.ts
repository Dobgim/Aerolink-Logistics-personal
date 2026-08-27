import type { NextRequest } from "next/server";
import {
  createShipment,
  isTrackingNumberTaken,
  listShipments,
  addTrackingEvent,
} from "@/lib/data/repository";
import { createShipmentSchema } from "@/lib/validations/schemas";
import { badRequest, handle, isResponse, ok, requireAdmin } from "@/lib/api/respond";
import { generateTrackingNumber } from "@/lib/utils/format";
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

    const shipment = await createShipment({
      tracking_number: trackingNumber,
      sender_name: input.sender_name,
      sender_email: input.sender_email ?? null,
      sender_phone: input.sender_phone ?? null,
      receiver_name: input.receiver_name,
      receiver_email: input.receiver_email ?? null,
      receiver_phone: input.receiver_phone ?? null,
      origin_country: input.origin_country,
      origin_city: input.origin_city,
      destination_country: input.destination_country,
      destination_city: input.destination_city,
      package_type: input.package_type,
      weight: input.weight,
      packages: input.packages,
      shipping_service: input.shipping_service,
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
          : "Shipment created and entered into the AeroLink network.",
      event_date: new Date().toISOString(),
    });

    return ok({ shipment }, 201);
  });
}
