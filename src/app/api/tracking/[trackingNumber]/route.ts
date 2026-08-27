import type { NextRequest } from "next/server";
import { getShipmentByTracking } from "@/lib/data/repository";
import { badRequest, handle, notFound, ok } from "@/lib/api/respond";
import { normalizeTrackingNumber } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

/**
 * Public tracking endpoint. Returns the shipment plus its full scan history.
 * Contact emails are withheld — tracking is open to anyone holding the number.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ trackingNumber: string }> },
) {
  return handle(async () => {
    const { trackingNumber } = await params;
    const normalized = normalizeTrackingNumber(decodeURIComponent(trackingNumber));

    if (normalized.length < 6) {
      return badRequest("That does not look like a valid tracking number");
    }

    const shipment = await getShipmentByTracking(normalized);
    if (!shipment) {
      return notFound("We couldn't find a shipment with that tracking number");
    }

    const { sender_email, receiver_email, ...publicFields } = shipment;
    void sender_email;
    void receiver_email;

    return ok({ shipment: publicFields });
  });
}
