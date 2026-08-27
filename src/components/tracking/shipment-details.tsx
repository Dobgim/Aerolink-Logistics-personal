import {
  Boxes,
  CalendarClock,
  Hash,
  MapPin,
  Navigation,
  PackageOpen,
  Scale,
  Ship,
  UserRound,
  Users,
} from "lucide-react";
import type { Shipment } from "@/types";
import { Card, DataItem } from "@/components/ui/primitives";
import {
  PACKAGE_LABELS,
  SERVICE_LABELS,
  formatDate,
  formatWeight,
} from "@/lib/utils/format";

export function ShipmentDetails({ shipment }: { shipment: Shipment }) {
  const origin = `${shipment.origin_city}, ${shipment.origin_country}`;
  const destination = `${shipment.destination_city}, ${shipment.destination_country}`;

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <Card>
        <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-ink-500">
          Shipment
        </h3>
        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5">
          <DataItem
            label="Tracking number"
            icon={<Hash aria-hidden className="size-3.5" />}
            value={<span className="font-mono text-sm">{shipment.tracking_number}</span>}
            className="col-span-2"
          />
          <DataItem
            label="Shipment type"
            icon={<PackageOpen aria-hidden className="size-3.5" />}
            value={PACKAGE_LABELS[shipment.package_type]}
          />
          <DataItem
            label="Service"
            icon={<Ship aria-hidden className="size-3.5" />}
            value={SERVICE_LABELS[shipment.shipping_service]}
          />
          <DataItem
            label="Weight"
            icon={<Scale aria-hidden className="size-3.5" />}
            value={formatWeight(shipment.weight)}
          />
          <DataItem
            label="Packages"
            icon={<Boxes aria-hidden className="size-3.5" />}
            value={`${shipment.packages} ${shipment.packages === 1 ? "piece" : "pieces"}`}
          />
        </dl>
      </Card>

      <Card>
        <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-ink-500">Route</h3>
        <dl className="mt-4 grid gap-5">
          <DataItem
            label="Origin"
            icon={<MapPin aria-hidden className="size-3.5" />}
            value={origin}
          />
          <DataItem
            label="Destination"
            icon={<MapPin aria-hidden className="size-3.5" />}
            value={destination}
          />
          <DataItem
            label="Current location"
            icon={<Navigation aria-hidden className="size-3.5" />}
            value={shipment.current_location ?? "Awaiting first scan"}
          />
          <div className="grid grid-cols-2 gap-4">
            <DataItem
              label="Estimated delivery"
              icon={<CalendarClock aria-hidden className="size-3.5" />}
              value={formatDate(shipment.estimated_delivery)}
            />
            <DataItem
              label="Created"
              icon={<CalendarClock aria-hidden className="size-3.5" />}
              value={formatDate(shipment.created_at)}
            />
          </div>
        </dl>
      </Card>

      <Card>
        <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-ink-500">Parties</h3>
        <dl className="mt-4 grid gap-5">
          <DataItem
            label="Sender"
            icon={<UserRound aria-hidden className="size-3.5" />}
            value={
              <span className="block">
                {shipment.sender_name}
                {shipment.sender_phone ? (
                  <span className="mt-0.5 block text-sm font-normal text-ink-600">
                    {shipment.sender_phone}
                  </span>
                ) : null}
              </span>
            }
          />
          <DataItem
            label="Receiver"
            icon={<Users aria-hidden className="size-3.5" />}
            value={
              <span className="block">
                {shipment.receiver_name}
                {shipment.receiver_phone ? (
                  <span className="mt-0.5 block text-sm font-normal text-ink-600">
                    {shipment.receiver_phone}
                  </span>
                ) : null}
              </span>
            }
          />
          <p className="rounded-lg bg-ink-50 p-3 text-xs leading-relaxed text-ink-600">
            Contact details are shown in part for privacy. Sign in to your AeroLink account to see
            the full record for shipments on your account.
          </p>
        </dl>
      </Card>
    </div>
  );
}
