"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DashboardStats } from "@/types";
import { STATUS_LABELS } from "@/lib/utils/format";

/* Categorical palette — distinguishable in both light and dark surroundings. */
const SERIES = {
  created: "#3161f7",
  delivered: "#0e9f6e",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "#909cb0",
  picked_up: "#598aff",
  in_transit: "#3161f7",
  customs: "#f0a202",
  out_for_delivery: "#fb5c11",
  delivered: "#0e9f6e",
  delayed: "#e0821b",
  exception: "#d33a3a",
};

const AXIS = {
  fontSize: 12,
  fill: "#6a7688",
  fontWeight: 600,
};

function TooltipBox({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name?: string; value?: number; color?: string; dataKey?: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-ink-200 bg-white px-3 py-2 shadow-lift">
      <p className="text-xs font-bold text-ink-900">{label}</p>
      <ul className="mt-1 space-y-0.5">
        {payload.map((entry) => (
          <li key={entry.dataKey} className="flex items-center gap-2 text-xs text-ink-600">
            <span
              aria-hidden
              className="size-2 rounded-full"
              style={{ background: entry.color }}
            />
            {entry.name}: <strong className="font-bold text-ink-900">{entry.value}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function VolumeChart({ data }: { data: DashboardStats["by_month"] }) {
  return (
    <div className="h-64 w-full sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
          <defs>
            <linearGradient id="fill-created" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={SERIES.created} stopOpacity={0.28} />
              <stop offset="100%" stopColor={SERIES.created} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="fill-delivered" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={SERIES.delivered} stopOpacity={0.24} />
              <stop offset="100%" stopColor={SERIES.delivered} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#eef0f4" vertical={false} />
          <XAxis dataKey="month" tick={AXIS} tickLine={false} axisLine={false} />
          <YAxis tick={AXIS} tickLine={false} axisLine={false} allowDecimals={false} width={40} />
          <Tooltip content={<TooltipBox />} cursor={{ stroke: "#c3cad6" }} />
          <Area
            type="monotone"
            dataKey="created"
            name="Created"
            stroke={SERIES.created}
            strokeWidth={2.5}
            fill="url(#fill-created)"
          />
          <Area
            type="monotone"
            dataKey="delivered"
            name="Delivered"
            stroke={SERIES.delivered}
            strokeWidth={2.5}
            fill="url(#fill-delivered)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StatusChart({ data }: { data: DashboardStats["by_status"] }) {
  const rows = data.map((d) => ({
    name: STATUS_LABELS[d.status],
    count: d.count,
    status: d.status,
  }));

  return (
    <div className="h-64 w-full sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 16, bottom: 0, left: 8 }}>
          <CartesianGrid stroke="#eef0f4" horizontal={false} />
          <XAxis type="number" tick={AXIS} tickLine={false} axisLine={false} allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="name"
            tick={AXIS}
            tickLine={false}
            axisLine={false}
            width={112}
          />
          <Tooltip content={<TooltipBox />} cursor={{ fill: "#f7f8fa" }} />
          <Bar dataKey="count" name="Shipments" radius={[0, 6, 6, 0]} maxBarSize={22}>
            {rows.map((row) => (
              <Cell key={row.status} fill={STATUS_COLORS[row.status] ?? SERIES.created} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
