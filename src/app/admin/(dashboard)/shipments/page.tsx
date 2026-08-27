import Link from "next/link";
import { ArrowRight, Package, Plus } from "lucide-react";
import { Badge, Card, type BadgeTone } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { FilterBar } from "@/components/admin/filter-bar";
import { listShipments } from "@/lib/data/repository";
import {
  SERVICE_LABELS,
  STATUS_LABELS,
  STATUS_TONE,
  formatDate,
  formatWeight,
} from "@/lib/utils/format";
import type { ShipmentStatus } from "@/types";

export const metadata = { title: "Shipments" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

interface PageProps {
  searchParams: Promise<{ status?: string; search?: string; offset?: string }>;
}

export default async function AdminShipmentsPage({ searchParams }: PageProps) {
  const { status = "all", search = "", offset = "0" } = await searchParams;
  const start = Math.max(Number(offset) || 0, 0);

  const { rows, total } = await listShipments({
    status: status as ShipmentStatus | "all",
    search,
    limit: PAGE_SIZE,
    offset: start,
  });

  const query = (nextOffset: number) => {
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    if (search) params.set("search", search);
    if (nextOffset > 0) params.set("offset", String(nextOffset));
    const qs = params.toString();
    return qs ? `/admin/shipments?${qs}` : "/admin/shipments";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink-900 sm:text-3xl">Shipments</h1>
          <p className="mt-1.5 text-sm text-ink-600">
            {total} {total === 1 ? "shipment" : "shipments"} in the network
            {status !== "all" ? ` · filtered by ${STATUS_LABELS[status as ShipmentStatus]}` : ""}
          </p>
        </div>
        <ButtonLink
          href="/admin/shipments/new"
          size="md"
          icon={<Plus aria-hidden className="size-4" />}
        >
          Create shipment
        </ButtonLink>
      </div>

      <Card>
        <FilterBar />
      </Card>

      {rows.length === 0 ? (
        <Card className="py-16 text-center">
          <Package aria-hidden className="mx-auto size-10 text-ink-300" />
          <h2 className="mt-4 text-lg font-bold text-ink-900">No shipments match</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink-600">
            Adjust the filters, or create the first shipment for this route.
          </p>
          <ButtonLink href="/admin/shipments/new" size="md" className="mt-6">
            Create shipment
          </ButtonLink>
        </Card>
      ) : (
        <>
          {/* Desktop: full table. Mobile: stacked cards. */}
          <Card padded={false} className="hidden overflow-hidden lg:block">
            <div className="scroll-x">
              <table className="w-full min-w-[62rem] border-collapse text-left">
                <caption className="sr-only">
                  All shipments with status, route, service and estimated delivery
                </caption>
                <thead>
                  <tr className="border-b border-ink-200 bg-ink-50">
                    {["Tracking number", "Status", "Route", "Service", "Weight", "ETA", ""].map(
                      (heading) => (
                        <th
                          key={heading}
                          scope="col"
                          className="px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-ink-500"
                        >
                          {heading}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-200">
                  {rows.map((shipment) => (
                    <tr key={shipment.id} className="transition-colors hover:bg-ink-50">
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/shipments/${shipment.id}`}
                          className="font-mono text-sm font-semibold text-brand-800 hover:underline"
                        >
                          {shipment.tracking_number}
                        </Link>
                        <p className="mt-0.5 text-xs text-ink-500">{shipment.receiver_name}</p>
                      </td>
                      <td className="px-5 py-4">
                        <Badge tone={(STATUS_TONE[shipment.status] as BadgeTone) ?? "neutral"}>
                          {STATUS_LABELS[shipment.status]}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-sm text-ink-700">
                        {shipment.origin_city} → {shipment.destination_city}
                        <p className="mt-0.5 text-xs text-ink-500">
                          {shipment.current_location ?? "Not yet collected"}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-sm text-ink-700">
                        {SERVICE_LABELS[shipment.shipping_service]}
                      </td>
                      <td className="px-5 py-4 text-sm text-ink-700">
                        {formatWeight(shipment.weight)}
                        <p className="mt-0.5 text-xs text-ink-500">{shipment.packages} pcs</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-ink-700">
                        {formatDate(shipment.estimated_delivery)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/admin/shipments/${shipment.id}`}
                          className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-900"
                          aria-label={`Manage shipment ${shipment.tracking_number}`}
                        >
                          Manage
                          <ArrowRight aria-hidden className="size-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <ul className="grid gap-4 sm:grid-cols-2 lg:hidden">
            {rows.map((shipment) => (
              <li key={shipment.id}>
                <Link href={`/admin/shipments/${shipment.id}`} className="block">
                  <Card interactive className="h-full">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-mono text-sm font-bold text-brand-800">
                        {shipment.tracking_number}
                      </p>
                      <Badge tone={(STATUS_TONE[shipment.status] as BadgeTone) ?? "neutral"}>
                        {STATUS_LABELS[shipment.status]}
                      </Badge>
                    </div>

                    <p className="mt-3 text-sm font-semibold text-ink-900">
                      {shipment.origin_city} → {shipment.destination_city}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-500">
                      {shipment.current_location ?? "Not yet collected"}
                    </p>

                    <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-ink-200 pt-3 text-xs">
                      <div>
                        <dt className="font-semibold text-ink-500">Receiver</dt>
                        <dd className="mt-0.5 truncate font-semibold text-ink-800">
                          {shipment.receiver_name}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-ink-500">ETA</dt>
                        <dd className="mt-0.5 font-semibold text-ink-800">
                          {formatDate(shipment.estimated_delivery)}
                        </dd>
                      </div>
                    </dl>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>

          {total > PAGE_SIZE ? (
            <nav
              aria-label="Pagination"
              className="flex items-center justify-between gap-4 rounded-xl border border-ink-200 bg-white px-5 py-4"
            >
              <p className="text-sm text-ink-600">
                Showing {start + 1}–{Math.min(start + PAGE_SIZE, total)} of {total}
              </p>
              <div className="flex gap-2">
                <ButtonLink
                  href={query(Math.max(start - PAGE_SIZE, 0))}
                  variant="outline"
                  size="sm"
                  aria-disabled={start === 0}
                  className={start === 0 ? "pointer-events-none opacity-50" : ""}
                >
                  Previous
                </ButtonLink>
                <ButtonLink
                  href={query(start + PAGE_SIZE)}
                  variant="outline"
                  size="sm"
                  aria-disabled={start + PAGE_SIZE >= total}
                  className={start + PAGE_SIZE >= total ? "pointer-events-none opacity-50" : ""}
                >
                  Next
                </ButtonLink>
              </div>
            </nav>
          ) : null}
        </>
      )}
    </div>
  );
}
