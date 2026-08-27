import Link from "next/link";
import { MapPin, Radio } from "lucide-react";
import { Badge, Card, type BadgeTone } from "@/components/ui/primitives";
import { listRecentEvents, listShipments } from "@/lib/data/repository";
import { STATUS_LABELS, STATUS_TONE, formatDateTime } from "@/lib/utils/format";

export const metadata = { title: "Tracking Events" };
export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const [events, { rows: shipments }] = await Promise.all([
    listRecentEvents(50),
    listShipments({ limit: 1000 }),
  ]);

  const idFor = (trackingNumber: string) =>
    shipments.find((s) => s.tracking_number === trackingNumber)?.id;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink-900 sm:text-3xl">Tracking events</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-ink-600">
          The 50 most recent scans across the network. Post new scans from a shipment&apos;s page —
          that keeps the event, the status and the map in step.
        </p>
      </div>

      {events.length === 0 ? (
        <Card className="py-16 text-center">
          <Radio aria-hidden className="mx-auto size-10 text-ink-300" />
          <h2 className="mt-4 text-lg font-bold text-ink-900">No scans recorded yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink-600">
            Create a shipment and post its first scan to start the tracking history.
          </p>
        </Card>
      ) : (
        <Card padded={false} className="overflow-hidden">
          <ul className="divide-y divide-ink-200">
            {events.map((event) => {
              const shipmentId = idFor(event.tracking_number);

              return (
                <li key={event.id} className="px-5 py-4 transition-colors hover:bg-ink-50">
                  <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        {shipmentId ? (
                          <Link
                            href={`/admin/shipments/${shipmentId}`}
                            className="font-mono text-sm font-bold text-brand-800 hover:underline"
                          >
                            {event.tracking_number}
                          </Link>
                        ) : (
                          <span className="font-mono text-sm font-bold text-ink-700">
                            {event.tracking_number}
                          </span>
                        )}
                        <Badge tone={(STATUS_TONE[event.status] as BadgeTone) ?? "neutral"}>
                          {STATUS_LABELS[event.status]}
                        </Badge>
                      </div>
                      <p className="mt-1.5 text-sm text-ink-600">{event.description}</p>
                      <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500">
                        <MapPin aria-hidden className="size-3.5" />
                        {event.location}
                      </p>
                    </div>

                    <time
                      dateTime={event.event_date}
                      className="shrink-0 text-xs font-semibold text-ink-500"
                    >
                      {formatDateTime(event.event_date)}
                    </time>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </div>
  );
}
