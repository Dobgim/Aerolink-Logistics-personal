"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Building2, MapPin, Navigation, Search, X } from "lucide-react";
import type { ServiceLocation } from "@/types";
import { Badge, Card } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { ShipmentMap, type MapPoint } from "@/components/map/shipment-map";
import { SERVICE_LABELS } from "@/lib/utils/format";
import { EASE } from "@/components/ui/motion";

interface Props {
  locations: ServiceLocation[];
  initialQuery?: string;
}

const PAGE_SIZE = 12;

/**
 * A search-driven service-point finder.
 *
 * There is deliberately no country or city dropdown: enumerating them would
 * publish a fixed list of served destinations, which goes stale the moment a
 * lane changes. Customers search for the address they actually care about, and
 * the exact lane is confirmed at booking.
 */
export function LocationsExplorer({ locations, initialQuery = "" }: Props) {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState(initialQuery);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return locations.filter((l) =>
      [l.country, l.city, l.town ?? "", l.address].join(" ").toLowerCase().includes(term),
    );
  }, [locations, query]);

  // With no search yet, the map still shows the shape of the network.
  const points: MapPoint[] = useMemo(
    () =>
      (filtered.length > 0 ? filtered : locations).slice(0, 80).map((l) => ({
        kind: "hub" as const,
        label: `${l.city}, ${l.country}`,
        lat: l.latitude,
        lng: l.longitude,
      })),
    [filtered, locations],
  );

  const searching = query.trim() !== "";

  function reset() {
    setQuery("");
    setVisible(PAGE_SIZE);
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <Input
            label="Search a city, town or address"
            placeholder="Type where the shipment is going"
            value={query}
            leading={<Search aria-hidden className="size-4" />}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisible(PAGE_SIZE);
            }}
          />

          <Button
            variant="outline"
            size="md"
            onClick={reset}
            disabled={!searching}
            icon={<X aria-hidden className="size-4" />}
            className="md:mb-0"
          >
            Clear
          </Button>
        </div>

        <p className="mt-4 text-sm font-semibold text-ink-600" role="status" aria-live="polite">
          {searching
            ? `${filtered.length} service ${filtered.length === 1 ? "point" : "points"} match your search`
            : "Search for a destination to find the nearest staffed service point."}
        </p>
        <p className="mt-1 text-xs text-ink-500">
          Delivery rounds reach well beyond these counters — if an address receives post, we can
          usually reach it. Your exact lane is confirmed when you book.
        </p>
      </Card>

      <Card padded={false} className="overflow-hidden">
        <div className="border-b border-ink-200 px-5 py-4">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.1em] text-ink-600">
            <Navigation aria-hidden className="size-4 text-brand-700" />
            Network map
          </h2>
        </div>
        <ShipmentMap
          points={points}
          connect={false}
          className="rounded-none"
          heightClassName="h-72 sm:h-96 lg:h-[34rem]"
        />
      </Card>

      {filtered.length === 0 ? (
        <Card className="py-14 text-center">
          <MapPin aria-hidden className="mx-auto size-10 text-ink-300" />
          <h2 className="mt-4 text-lg font-bold text-ink-900">
            {searching ? "No service points match" : "Search to find a service point"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-600">
            {searching
              ? "Try a nearby larger town. We deliver well beyond our staffed counters, so a destination without one is usually still served."
              : "Type a city, town or address above and we will show the nearest staffed counters."}
          </p>
          {searching ? (
            <Button variant="outline" size="md" className="mt-6" onClick={reset}>
              Clear search
            </Button>
          ) : null}
        </Card>
      ) : (
        <>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence initial={false} mode="popLayout">
              {filtered.slice(0, visible).map((location, i) => (
                <motion.li
                  key={location.id}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                  transition={{
                    duration: 0.32,
                    ease: EASE,
                    delay: reduce ? 0 : Math.min(i, 8) * 0.03,
                  }}
                >
                  <Card interactive className="h-full">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-bold text-ink-900">
                          {location.city}
                        </h3>
                        <p className="mt-0.5 text-sm text-ink-500">{location.country}</p>
                      </div>
                      <Badge tone="brand">Open</Badge>
                    </div>

                    <p className="mt-4 flex items-start gap-2 text-sm text-ink-600">
                      <Building2 aria-hidden className="mt-0.5 size-3.5 shrink-0 text-ink-400" />
                      {location.address}
                    </p>

                    {location.town ? (
                      <p className="mt-2 text-xs text-ink-500">
                        Also serving {location.town} and surrounding towns
                      </p>
                    ) : null}

                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {location.available_services.slice(0, 3).map((service) => (
                        <li key={service}>
                          <Badge tone="neutral">{SERVICE_LABELS[service]}</Badge>
                        </li>
                      ))}
                      {location.available_services.length > 3 ? (
                        <li>
                          <Badge tone="neutral">
                            +{location.available_services.length - 3} more
                          </Badge>
                        </li>
                      ) : null}
                    </ul>
                  </Card>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {visible < filtered.length ? (
            <div className="text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
              >
                Show more service points ({filtered.length - visible} remaining)
              </Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
