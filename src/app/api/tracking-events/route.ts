import type { NextRequest } from "next/server";
import {
  addTrackingEvent,
  getShipment,
  listRecentEvents,
  updateShipment,
} from "@/lib/data/repository";
import { trackingEventSchema } from "@/lib/validations/schemas";
import { handle, isResponse, notFound, ok, requireAdmin } from "@/lib/api/respond";
import { geocodeCity } from "@/lib/constants/geo";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return handle(async () => {
    const auth = await requireAdmin();
    if (isResponse(auth)) return auth.response;

    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit") ?? 12) || 12, 50);
    return ok({ events: await listRecentEvents(limit) });
  });
}

/**
 * Adding a scan is the single write that drives the customer experience:
 * it records the event, then advances the shipment's status, current location
 * and map coordinates so the timeline and the map stay in step.
 */
export async function POST(request: NextRequest) {
  return handle(async () => {
    const auth = await requireAdmin();
    if (isResponse(auth)) return auth.response;

    const body = await request.json();
    const input = trackingEventSchema.parse(body);

    const shipment = await getShipment(input.shipment_id);
    if (!shipment) return notFound("Shipment not found");

    const coords =
      input.latitude != null && input.longitude != null
        ? { lat: input.latitude, lng: input.longitude }
        : geocodeCity(input.location.split(",")[0]?.trim());

    const event = await addTrackingEvent({
      shipment_id: input.shipment_id,
      status: input.status,
      location: input.location,
      latitude: coords?.lat ?? null,
      longitude: coords?.lng ?? null,
      description: input.description,
      event_date: input.event_date,
    });

    let updated = shipment;
    if (input.sync_shipment) {
      const patched = await updateShipment(shipment.id, {
        status: input.status,
        current_location: input.location,
        latitude: coords?.lat ?? null,
        longitude: coords?.lng ?? null,
      });
      if (patched) updated = { ...shipment, ...patched };
    }

    return ok({ event, shipment: updated }, 201);
  });
}
