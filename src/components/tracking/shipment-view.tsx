import { History, MapPinned } from "lucide-react";
import type { ShipmentWithEvents } from "@/types";
import { Card } from "@/components/ui/primitives";
import { StatusHeader } from "./status-header";
import { TrackingTimeline } from "./timeline";
import { ShipmentDetails } from "./shipment-details";
import { ShipmentMap, type MapPoint } from "@/components/map/shipment-map";
import { geocodeCity } from "@/lib/constants/geo";

/** Builds origin → current → destination markers, skipping anything unplaceable. */
export function mapPointsFor(shipment: ShipmentWithEvents): MapPoint[] {
  const points: MapPoint[] = [];

  const origin = geocodeCity(shipment.origin_city, shipment.origin_country);
  if (origin) {
    points.push({
      kind: "origin",
      label: `${shipment.origin_city}, ${shipment.origin_country}`,
      ...origin,
    });
  }

  const currentCity = shipment.current_location?.split(",")[0]?.trim();
  const current =
    shipment.latitude != null && shipment.longitude != null
      ? { lat: shipment.latitude, lng: shipment.longitude }
      : geocodeCity(currentCity);
  if (current && shipment.current_location) {
    points.push({ kind: "current", label: shipment.current_location, ...current });
  }

  const destination = geocodeCity(shipment.destination_city, shipment.destination_country);
  if (destination) {
    points.push({
      kind: "destination",
      label: `${shipment.destination_city}, ${shipment.destination_country}`,
      ...destination,
    });
  }

  return points;
}

export function ShipmentView({ shipment }: { shipment: ShipmentWithEvents }) {
  const points = mapPointsFor(shipment);

  return (
    <div className="space-y-5">
      <StatusHeader shipment={shipment} />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <Card padded={false} className="overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-ink-200 px-5 py-4">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.1em] text-ink-600">
              <MapPinned aria-hidden className="size-4 text-brand-700" />
              Current Shipment Location
            </h3>
            {shipment.current_location ? (
              <p className="truncate text-sm font-semibold text-ink-900">
                {shipment.current_location}
              </p>
            ) : null}
          </div>
          <ShipmentMap points={points} className="rounded-none" />
        </Card>

        <Card id="history" className="scroll-mt-28">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.1em] text-ink-600">
            <History aria-hidden className="size-4 text-brand-700" />
            Tracking History
          </h3>
          <div className="mt-6 max-h-[32rem] overflow-y-auto pr-1">
            <TrackingTimeline events={shipment.tracking_events} />
          </div>
        </Card>
      </div>

      <ShipmentDetails shipment={shipment} />
    </div>
  );
}
