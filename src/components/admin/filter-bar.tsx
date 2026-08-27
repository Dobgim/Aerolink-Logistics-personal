"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { Loader2, Search } from "lucide-react";
import { Input, Select } from "@/components/ui/field";
import { STATUS_LABELS } from "@/lib/utils/format";
import type { ShipmentStatus } from "@/types";

const STATUSES = Object.keys(STATUS_LABELS) as ShipmentStatus[];

interface Props {
  showStatus?: boolean;
  searchLabel?: string;
  searchPlaceholder?: string;
  extra?: { name: string; label: string; options: { value: string; label: string }[] };
}

/**
 * Filters live in the URL, so the server does the querying and every filtered
 * view is a shareable, reloadable link.
 */
export function FilterBar({
  showStatus = true,
  searchLabel = "Search",
  searchPlaceholder = "Tracking number, name or city",
  extra,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [term, setTerm] = useState(params.get("search") ?? "");
  const firstRender = useRef(true);

  function push(next: URLSearchParams) {
    next.delete("offset");
    startTransition(() => {
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    });
  }

  // Debounce free-text search so we are not pushing a route per keystroke.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const id = window.setTimeout(() => {
      const next = new URLSearchParams(params.toString());
      if (term.trim()) next.set("search", term.trim());
      else next.delete("search");
      push(next);
    }, 320);

    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term]);

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value && value !== "all") next.set(key, value);
    else next.delete(key);
    push(next);
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
      <Input
        label={searchLabel}
        placeholder={searchPlaceholder}
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        leading={
          pending ? (
            <Loader2 aria-hidden className="size-4 animate-spin" />
          ) : (
            <Search aria-hidden className="size-4" />
          )
        }
      />

      {showStatus ? (
        <Select
          label="Status"
          value={params.get("status") ?? "all"}
          onChange={(e) => setParam("status", e.target.value)}
        >
          <option value="all">All statuses</option>
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </Select>
      ) : null}

      {extra ? (
        <Select
          label={extra.label}
          value={params.get(extra.name) ?? "all"}
          onChange={(e) => setParam(extra.name, e.target.value)}
        >
          <option value="all">All</option>
          {extra.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : null}
    </div>
  );
}
