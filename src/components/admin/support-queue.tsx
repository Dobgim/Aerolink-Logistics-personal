"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Hash, LifeBuoy, Mail, PhoneCall } from "lucide-react";
import type { SupportRequest, SupportStatus } from "@/types";
import { Badge, Card, type BadgeTone } from "@/components/ui/primitives";
import { Select } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { SUPPORT_STATUS_LABELS, formatDateTime } from "@/lib/utils/format";
import { EASE } from "@/components/ui/motion";

const STATUSES = Object.keys(SUPPORT_STATUS_LABELS) as SupportStatus[];

const TONES: Record<SupportStatus, BadgeTone> = {
  open: "accent",
  in_progress: "brand",
  resolved: "success",
  closed: "neutral",
};

export function SupportQueue({ requests }: { requests: SupportRequest[] }) {
  const router = useRouter();
  const toast = useToast();
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<SupportStatus | "all">("all");
  const [busy, setBusy] = useState<string | null>(null);

  const visible = filter === "all" ? requests : requests.filter((r) => r.status === filter);

  async function setStatus(id: string, status: SupportStatus) {
    setBusy(id);
    try {
      const response = await fetch(`/api/support/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        toast.error("Could not update request", payload.error);
        return;
      }
      toast.success("Request updated", SUPPORT_STATUS_LABELS[status]);
      router.refresh();
    } catch {
      toast.error("Network error", "Check your connection and try again.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-5">
      <Card>
        <div className="grid gap-4 sm:max-w-xs">
          <Select
            label="Filter by status"
            value={filter}
            onChange={(e) => setFilter(e.target.value as SupportStatus | "all")}
          >
            <option value="all">All requests ({requests.length})</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {SUPPORT_STATUS_LABELS[status]} (
                {requests.filter((r) => r.status === status).length})
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {visible.length === 0 ? (
        <Card className="py-16 text-center">
          <LifeBuoy aria-hidden className="mx-auto size-10 text-ink-300" />
          <h2 className="mt-4 text-lg font-bold text-ink-900">Nothing in this queue</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink-600">
            Requests from the contact form and collection bookings land here.
          </p>
        </Card>
      ) : (
        <ul className="space-y-4">
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((request) => (
              <motion.li
                key={request.id}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.28, ease: EASE }}
              >
                <Card>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-base font-bold text-ink-900">{request.subject}</h2>
                        <Badge tone={TONES[request.status]} dot>
                          {SUPPORT_STATUS_LABELS[request.status]}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-ink-500">
                        {request.name} · {formatDateTime(request.created_at)}
                      </p>
                    </div>

                    <div className="w-full sm:w-52">
                      <Select
                        aria-label={`Set status for ${request.subject}`}
                        value={request.status}
                        disabled={busy === request.id}
                        onChange={(e) => setStatus(request.id, e.target.value as SupportStatus)}
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {SUPPORT_STATUS_LABELS[status]}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>

                  <p className="mt-4 whitespace-pre-line rounded-xl bg-ink-50 p-4 text-sm leading-relaxed text-ink-700">
                    {request.message}
                  </p>

                  <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-ink-200 pt-4 text-sm">
                    <li className="inline-flex items-center gap-1.5">
                      <Mail aria-hidden className="size-3.5 text-ink-400" />
                      <a
                        href={`mailto:${request.email}?subject=${encodeURIComponent(`Re: ${request.subject}`)}`}
                        className="break-all font-semibold text-brand-700 hover:underline"
                      >
                        {request.email}
                      </a>
                    </li>
                    {request.phone ? (
                      <li className="inline-flex items-center gap-1.5">
                        <PhoneCall aria-hidden className="size-3.5 text-ink-400" />
                        <a
                          href={`tel:${request.phone.replace(/\s/g, "")}`}
                          className="font-semibold text-ink-700 hover:text-brand-700"
                        >
                          {request.phone}
                        </a>
                      </li>
                    ) : null}
                    {request.tracking_number ? (
                      <li className="inline-flex items-center gap-1.5">
                        <Hash aria-hidden className="size-3.5 text-ink-400" />
                        <a
                          href={`/tracking?number=${encodeURIComponent(request.tracking_number)}`}
                          className="font-mono text-xs font-semibold text-brand-700 hover:underline"
                        >
                          {request.tracking_number}
                        </a>
                      </li>
                    ) : null}
                  </ul>
                </Card>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
