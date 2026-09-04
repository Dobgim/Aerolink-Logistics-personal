import type {
  AppUser,
  ServiceLocation,
  Shipment,
  SupportRequest,
  TrackingEvent,
} from "@/types";
import { EUROPE, ORIGIN_MARKETS } from "@/lib/constants/geo";

export interface SeedData {
  users: AppUser[];
  shipments: Shipment[];
  events: TrackingEvent[];
  locations: ServiceLocation[];
  support: SupportRequest[];
}

/**
 * The starting contents of the in-process store used when no Supabase project
 * is configured.
 *
 * It carries the published service-point directory and **nothing else**. There
 * are deliberately no shipments, customers or support requests: this is a live
 * business, and a fabricated consignment here is not a harmless placeholder —
 * the public tracking page answers from the same store, so an invented
 * tracking number would be served to a real visitor as though it were their
 * parcel, and the admin dashboard would report invented figures as trade.
 *
 * The directory is safe to keep because it is published reference data — the
 * network the site advertises — not a record of anything that happened.
 */
export function buildSeed(): SeedData {
  const locations: ServiceLocation[] = [];
  // Europe leads the directory; domestic origin markets follow.
  for (const market of [...EUROPE, ...ORIGIN_MARKETS]) {
    market.cities.forEach((city, i) => {
      locations.push({
        id: `loc_${market.code}_${i}`,
        country: market.country,
        city: city.city,
        town: city.towns?.[0] ?? null,
        latitude: city.lat,
        longitude: city.lng,
        address: `${market.hub} — ${city.city} Service Point`,
        available_services:
          i === 0
            ? [
                "express_international",
                "standard_international",
                "cargo_freight",
                "ecommerce",
                "business_logistics",
                "door_to_door",
              ]
            : ["express_international", "standard_international", "door_to_door"],
      });
    });
  }

  return { users: [], shipments: [], events: [], locations, support: [] };
}
