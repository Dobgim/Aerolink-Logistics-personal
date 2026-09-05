import "server-only";

import { geocodeCity } from "@/lib/constants/geo";
import { countryCoordinates } from "@/lib/constants/countries";

export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Coordinates for a free-text place, best source first:
 *
 *   1. the served-network table — instant, and covers the busiest lanes
 *   2. OpenStreetMap's Nominatim — so a city anywhere on earth resolves
 *   3. the country's own coordinate — a last resort that at least lands on
 *      the right country
 *
 * Step 2 is why this exists. The built-in table knows 71 cities across Europe
 * and the United States, and every other city on earth fell straight through to
 * its country's coordinate. Two places in one country therefore resolved to the
 * *same* point: Buea and Yaoundé both became Cameroon, which is a route of zero
 * length — no origin pin, no destination pin, nothing to draw a line between and
 * no distance for the package to travel along.
 */

/*
 * Nominatim asks callers not to hammer it. Lookups are cached for the life of
 * the server process and the same place in flight is shared rather than fetched
 * twice, so a page with three markers in one country makes at most three calls
 * ever, not three per view.
 */
const cache = new Map<string, Coordinates | null>();
const inFlight = new Map<string, Promise<Coordinates | null>>();

const NOMINATIM = "https://nominatim.openstreetmap.org/search";
/** Nominatim requires a User-Agent that identifies the application. */
const USER_AGENT = "FreightCargoXpress/1.0 (shipment route mapping)";
const TIMEOUT_MS = 4_000;

function keyFor(city: string, country?: string | null): string {
  return `${city.trim().toLowerCase()}|${(country ?? "").trim().toLowerCase()}`;
}

async function lookUpRemote(city: string, country?: string | null): Promise<Coordinates | null> {
  const params = new URLSearchParams({ format: "json", limit: "1", city: city.trim() });
  if (country) params.set("country", country.trim());

  try {
    const response = await fetch(`${NOMINATIM}?${params}`, {
      headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      // The coordinates of a city do not change; let the fetch cache hold them.
      cache: "force-cache",
    });
    if (!response.ok) return null;

    const results = (await response.json()) as { lat?: string; lon?: string }[];
    const hit = results?.[0];
    if (!hit?.lat || !hit?.lon) return null;

    const lat = Number(hit.lat);
    const lng = Number(hit.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
  } catch {
    /*
     * A geocoder that is slow, rate-limiting or unreachable must not stop a
     * shipment being saved or a tracking page rendering. The caller falls back
     * to the country coordinate.
     */
    return null;
  }
}

/** Resolves one place, preferring the local table and never throwing. */
export async function resolvePlace(
  city?: string | null,
  country?: string | null,
): Promise<Coordinates | null> {
  const trimmed = city?.trim();
  if (!trimmed) return countryCoordinates(country);

  const local = geocodeCity(trimmed, country);
  const fallback = countryCoordinates(country);
  /*
   * `geocodeCity` already falls back to the country itself, so a hit that is
   * merely the country coordinate is not a hit — it is the miss we are here to
   * improve on, and only then is the remote lookup worth making.
   */
  const localIsRealCity =
    local && (!fallback || local.lat !== fallback.lat || local.lng !== fallback.lng);
  if (localIsRealCity) return local;

  const key = keyFor(trimmed, country);
  if (cache.has(key)) return cache.get(key) ?? fallback;

  let pending = inFlight.get(key);
  if (!pending) {
    pending = lookUpRemote(trimmed, country);
    inFlight.set(key, pending);
  }

  const remote = await pending;
  inFlight.delete(key);
  cache.set(key, remote);

  return remote ?? fallback;
}
