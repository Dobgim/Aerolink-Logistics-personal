import type { NextRequest } from "next/server";
import { deleteShipment, getShipment, updateShipment } from "@/lib/data/repository";
import { updateShipmentSchema } from "@/lib/validations/schemas";
import { handle, isResponse, notFound, ok, requireAdmin } from "@/lib/api/respond";
import type { ShipmentPatch } from "@/lib/data/repository";

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

    const shipment = await updateShipment(id, patch);
    if (!shipment) return notFound("Shipment not found");

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
