import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  LifeBuoy,
  Package,
  PlaneTakeoff,
  Plus,
  Users,
} from "lucide-react";
import { Badge, Card } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { StatCard } from "@/components/admin/stat-card";
import { StatusChart, VolumeChart } from "@/components/admin/charts";
import { getStats, listRecentEvents, listShipments } from "@/lib/data/repository";
import { STATUS_LABELS, STATUS_TONE, formatDateTime, formatDate } from "@/lib/utils/format";
import type { BadgeTone } from "@/components/ui/primitives";

export const metadata = { title: "Overview" };
export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [stats, recent, events] = await Promise.all([
    getStats(),
    listShipments({ limit: 6 }),
    listRecentEvents(7),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink-900 sm:text-3xl">Operations overview</h1>
          <p className="mt-1.5 text-sm text-ink-600">
            Everything currently moving through the AeroLink network.
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard
          label="Total Shipments"
          value={stats.total}
          Icon={Package}
          href="/admin/shipments"
        />
        <StatCard
          label="In Transit"
          value={stats.in_transit}
          Icon={PlaneTakeoff}
          tone="brand"
          hint="Collected, flying or clearing customs"
          href="/admin/shipments?status=in_transit"
        />
        <StatCard
          label="Delivered"
          value={stats.delivered}
          Icon={CheckCircle2}
          tone="success"
          href="/admin/shipments?status=delivered"
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          Icon={Clock3}
          tone="neutral"
          hint="Awaiting first collection"
          href="/admin/shipments?status=pending"
        />
        <StatCard
          label="Delayed"
          value={stats.delayed}
          Icon={AlertTriangle}
          tone="warning"
          href="/admin/shipments?status=delayed"
        />
        <StatCard
          label="Total Customers"
          value={stats.customers}
          Icon={Users}
          tone="accent"
          href="/admin/customers"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-bold text-ink-900">Shipment volume</h2>
            <ul className="flex items-center gap-4 text-xs font-semibold text-ink-600">
              <li className="flex items-center gap-1.5">
                <span aria-hidden className="size-2 rounded-full bg-brand-500" />
                Created
              </li>
              <li className="flex items-center gap-1.5">
                <span aria-hidden className="size-2 rounded-full bg-emerald-600" />
                Delivered
              </li>
            </ul>
          </div>
          <p className="mt-1 text-xs text-ink-500">Last six months</p>
          <div className="mt-4">
            <VolumeChart data={stats.by_month} />
          </div>
        </Card>

        <Card>
          <h2 className="text-base font-bold text-ink-900">Current status mix</h2>
          <p className="mt-1 text-xs text-ink-500">Every shipment on the books right now</p>
          <div className="mt-4">
            <StatusChart data={stats.by_status} />
          </div>
        </Card>
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <Card padded={false} className="overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-ink-200 px-5 py-4">
            <h2 className="text-base font-bold text-ink-900">Latest shipments</h2>
            <Link
              href="/admin/shipments"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-900"
            >
              View all
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>

          <ul className="divide-y divide-ink-200">
            {recent.rows.map((shipment) => (
              <li key={shipment.id}>
                <Link
                  href={`/admin/shipments/${shipment.id}`}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4 transition-colors hover:bg-ink-50"
                >
                  <span className="font-mono text-sm font-semibold text-ink-900">
                    {shipment.tracking_number}
                  </span>
                  <Badge tone={(STATUS_TONE[shipment.status] as BadgeTone) ?? "neutral"}>
                    {STATUS_LABELS[shipment.status]}
                  </Badge>
                  <span className="w-full text-sm text-ink-600 sm:w-auto sm:flex-1">
                    {shipment.origin_city} → {shipment.destination_city}
                  </span>
                  <span className="text-xs text-ink-500">
                    ETA {formatDate(shipment.estimated_delivery)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-5">
          <Card padded={false} className="overflow-hidden">
            <div className="border-b border-ink-200 px-5 py-4">
              <h2 className="text-base font-bold text-ink-900">Recent tracking scans</h2>
            </div>
            <ul className="divide-y divide-ink-200">
              {events.map((event) => (
                <li key={event.id} className="px-5 py-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-mono text-xs font-semibold text-ink-700">
                      {event.tracking_number}
                    </p>
                    <p className="shrink-0 text-xs text-ink-500">
                      {formatDateTime(event.event_date)}
                    </p>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-ink-900">
                    {STATUS_LABELS[event.status]} · {event.location}
                  </p>
                </li>
              ))}
            </ul>
          </Card>

          <Card tone="brand">
            <div className="flex items-start gap-3">
              <LifeBuoy aria-hidden className="mt-0.5 size-5 shrink-0 text-brand-300" />
              <div>
                <h2 className="text-base font-bold text-white">
                  {stats.open_support} open support{" "}
                  {stats.open_support === 1 ? "request" : "requests"}
                </h2>
                <p className="mt-1.5 text-sm text-brand-200">
                  Customers waiting on a reply from the operations team.
                </p>
                <Link
                  href="/admin/support"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-white underline underline-offset-4"
                >
                  Open the queue
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
