import type { NextRequest } from "next/server";
import {
  addTrackingEvent,
  deleteShipment,
  getShipment,
  updateShipment,
} from "@/lib/data/repository";
import { updateShipmentSchema } from "@/lib/validations/schemas";
import { handle, isResponse, notFound, ok, requireAdmin } from "@/lib/api/respond";
import type { ShipmentPatch } from "@/lib/data/repository";
import { STATUS_SCAN_DESCRIPTION } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  return handle(async () => {
    const auth = await requireAdmin();
    if (isResponse(auth)) return auth.response;

    const { id } = await params;
    const shipment = await getShipment(id);
    if (!shipment) return notFound("Shipment not found");

    return ok({ shipment });
  });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  return handle(async () => {
    const auth = await requireAdmin();
    if (isResponse(auth)) return auth.response;

    const { id } = await params;
    const body = await request.json();
    const parsed = updateShipmentSchema.parse(body);

    // Strip undefined so a partial update never blanks untouched columns.
    const patch = Object.fromEntries(
      Object.entries(parsed).filter(([, value]) => value !== undefined),
    ) as ShipmentPatch;

    const before = await getShipment(id);
    if (!before) return notFound("Shipment not found");

    const shipment = await updateShipment(id, patch);
    if (!shipment) return notFound("Shipment not found");

    /*
     * A status changed here has to leave a scan behind.
     *
     * The customer's timeline is built from scans, and the map reads the newest
     * one to know when a held shipment stopped covering ground. Changing the
     * status silently would leave the timeline still saying "Pending" and,
     * worse, date the hold from the previous scan — so a package held halfway
     * would snap back to where it was then, losing the distance it had covered.
     */
    if (patch.status && patch.status !== before.status) {
      await addTrackingEvent({
        shipment_id: id,
        status: patch.status,
        location:
          shipment.current_location ?? `${shipment.origin_city}, ${shipment.origin_country}`,
        latitude: shipment.latitude ?? null,
        longitude: shipment.longitude ?? null,
        description: STATUS_SCAN_DESCRIPTION[patch.status],
        event_date: new Date().toISOString(),
      });
    }

    return ok({ shipment });
  });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  return handle(async () => {
    const auth = await requireAdmin();
    if (isResponse(auth)) return auth.response;

    const { id } = await params;
    const deleted = await deleteShipment(id);
    if (!deleted) return notFound("Shipment not found");

    return ok({ deleted: true });
  });
}
