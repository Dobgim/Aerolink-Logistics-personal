import type {
  AppUser,
  ServiceLocation,
  Shipment,
  ShipmentStatus,
  SupportRequest,
  TrackingEvent,
} from "@/types";
import { EUROPE, ORIGIN_MARKETS, geocodeCity } from "@/lib/constants/geo";

const DAY = 86_400_000;

function iso(offsetDays: number, hour = 9, minute = 0): string {
  const base = Date.now() + offsetDays * DAY;
  const d = new Date(base);
  d.setUTCHours(hour, minute, 0, 0);
  return d.toISOString();
}

interface EventBlueprint {
  status: ShipmentStatus;
  location: string;
  country?: string;
  description: string;
  offsetDays: number;
  hour: number;
}

interface ShipmentBlueprint {
  tracking_number: string;
  sender: [name: string, email: string, phone: string];
  receiver: [name: string, email: string, phone: string];
  origin: [country: string, city: string];
  destination: [country: string, city: string];
  package_type: Shipment["package_type"];
  weight: number;
  packages: number;
  shipping_service: Shipment["shipping_service"];
  status: ShipmentStatus;
  current: [city: string, country: string] | null;
  createdOffset: number;
  etaOffset: number;
  events: EventBlueprint[];
}

/** Reusable milestone chains so each shipment reads like a real scan history. */
function chain(
  origin: [string, string],
  hub: [string, string],
  destination: [string, string],
  startOffset: number,
  upTo: ShipmentStatus,
  extra?: { delayed?: boolean },
): EventBlueprint[] {
  const [oCountry, oCity] = origin;
  const [hCountry, hCity] = hub;
  const [dCountry, dCity] = destination;

  const all: EventBlueprint[] = [
    {
      status: "pending",
      location: `${oCity}, ${oCountry}`,
      country: oCountry,
      description: "Shipment created. Awaiting pickup from the sender address.",
      offsetDays: startOffset,
      hour: 8,
    },
    {
      status: "picked_up",
      location: `${oCity}, ${oCountry}`,
      country: oCountry,
      description: "Package picked up by an AeroLink courier.",
      offsetDays: startOffset,
      hour: 14,
    },
    {
      status: "in_transit",
      location: `${oCity}, ${oCountry}`,
      country: oCountry,
      description: "Departed origin facility on international air freight.",
      offsetDays: startOffset + 1,
      hour: 3,
    },
    {
      status: "in_transit",
      location: `${hCity}, ${hCountry}`,
      country: hCountry,
      description: `Arrived at the ${hCity} sorting hub.`,
      offsetDays: startOffset + 2,
      hour: 6,
    },
    {
      status: "customs",
      location: `${hCity}, ${hCountry}`,
      country: hCountry,
      description: "Presented to customs for import clearance.",
      offsetDays: startOffset + 2,
      hour: 11,
    },
    {
      status: "in_transit",
      location: `${dCity}, ${dCountry}`,
      country: dCountry,
      description: `Cleared customs and forwarded to the ${dCity} delivery station.`,
      offsetDays: startOffset + 3,
      hour: 7,
    },
    {
      status: "out_for_delivery",
      location: `${dCity}, ${dCountry}`,
      country: dCountry,
      description: "On the delivery vehicle for final delivery today.",
      offsetDays: startOffset + 4,
      hour: 7,
    },
    {
      status: "delivered",
      location: `${dCity}, ${dCountry}`,
      country: dCountry,
      description: "Delivered and signed for at the receiver address.",
      offsetDays: startOffset + 4,
      hour: 15,
    },
  ];

  const stopIndex: Record<ShipmentStatus, number> = {
    pending: 0,
    picked_up: 1,
    in_transit: 5,
    customs: 4,
    out_for_delivery: 6,
    delivered: 7,
    delayed: 5,
    exception: 5,
  };

  const cut = all.slice(0, stopIndex[upTo] + 1);

  if (extra?.delayed) {
    cut.push({
      status: "delayed",
      location: `${hCity}, ${hCountry}`,
      country: hCountry,
      description:
        "Delivery rescheduled — the connecting flight was held by severe weather at the hub.",
      offsetDays: startOffset + 3,
      hour: 18,
    });
  }

  return cut;
}

const BLUEPRINTS: ShipmentBlueprint[] = [
  {
    tracking_number: "ALX-2026-983456",
    sender: ["Daniel Whitfield", "daniel.whitfield@example.com", "+1 (212) 555-0117"],
    receiver: ["Camille Moreau", "camille.moreau@example.com", "+33 6 12 88 40 21"],
    origin: ["United States", "New York"],
    destination: ["France", "Paris"],
    package_type: "parcel",
    weight: 12.4,
    packages: 3,
    shipping_service: "express_international",
    status: "in_transit",
    current: ["Lyon", "France"],
    createdOffset: -5,
    etaOffset: 6,
    events: [
      ...chain(["United States", "New York"], ["France", "Paris"], ["France", "Paris"], -5, "customs"),
      {
        status: "in_transit",
        location: "Lyon, France",
        country: "France",
        description: "Departed the Lyon linehaul facility en route to Paris.",
        offsetDays: -1,
        hour: 4,
      },
    ],
  },
  {
    tracking_number: "ALX-2026-114872",
    sender: ["Brightline Logistics LLC", "ops@brightlinelogistics.example", "+1 (312) 555-0164"],
    receiver: ["Oliver Bennett", "oliver.bennett@example.com", "+44 7700 900211"],
    origin: ["United States", "Chicago"],
    destination: ["United Kingdom", "London"],
    package_type: "document",
    weight: 0.8,
    packages: 1,
    shipping_service: "express_international",
    status: "delivered",
    current: ["London", "United Kingdom"],
    createdOffset: -12,
    etaOffset: -8,
    events: chain(
      ["United States", "Chicago"],
      ["United Kingdom", "London"],
      ["United Kingdom", "London"],
      -12,
      "delivered",
    ),
  },
  {
    tracking_number: "ALX-2026-550193",
    sender: ["Atlas Textiles Inc.", "export@atlastextiles.example", "+1 (212) 555-0193"],
    receiver: ["Sofia Rossi", "sofia.rossi@example.com", "+39 340 118 2277"],
    origin: ["United States", "New York"],
    destination: ["Italy", "Milan"],
    package_type: "pallet",
    weight: 240,
    packages: 4,
    shipping_service: "cargo_freight",
    status: "customs",
    current: ["Milan", "Italy"],
    createdOffset: -6,
    etaOffset: 3,
    events: chain(["United States", "New York"], ["Italy", "Milan"], ["Italy", "Milan"], -6, "customs"),
  },
  {
    tracking_number: "ALX-2026-206741",
    sender: ["Rachel Adeyemi", "rachel.adeyemi@example.com", "+1 (404) 555-0148"],
    receiver: ["Lukas Weber", "lukas.weber@example.com", "+49 151 2233 4455"],
    origin: ["United States", "Atlanta"],
    destination: ["Germany", "Berlin"],
    package_type: "parcel",
    weight: 6.2,
    packages: 2,
    shipping_service: "standard_international",
    status: "out_for_delivery",
    current: ["Berlin", "Germany"],
    createdOffset: -7,
    etaOffset: 0,
    events: chain(
      ["United States", "Atlanta"],
      ["Germany", "Frankfurt"],
      ["Germany", "Berlin"],
      -7,
      "out_for_delivery",
    ),
  },
  {
    tracking_number: "ALX-2026-338920",
    sender: ["Harborline Seafoods", "logistics@harborlineseafoods.example", "+1 (617) 555-0129"],
    receiver: ["Anne de Vries", "anne.devries@example.com", "+31 6 2244 8899"],
    origin: ["United States", "New York"],
    destination: ["Netherlands", "Rotterdam"],
    package_type: "perishable",
    weight: 88.5,
    packages: 6,
    shipping_service: "cargo_freight",
    status: "delayed",
    current: ["Amsterdam", "Netherlands"],
    createdOffset: -9,
    etaOffset: 2,
    events: chain(
      ["United States", "New York"],
      ["Netherlands", "Amsterdam"],
      ["Netherlands", "Rotterdam"],
      -9,
      "in_transit",
      { delayed: true },
    ),
  },
  {
    tracking_number: "ALX-2026-472018",
    sender: ["Nova Commerce", "ship@novacommerce.example", "+1 (646) 555-0175"],
    receiver: ["Diego Fernández", "diego.fernandez@example.com", "+34 611 22 33 44"],
    origin: ["United States", "New York"],
    destination: ["Spain", "Madrid"],
    package_type: "parcel",
    weight: 3.1,
    packages: 1,
    shipping_service: "ecommerce",
    status: "in_transit",
    current: ["Madrid", "Spain"],
    createdOffset: -4,
    etaOffset: 4,
    events: chain(["United States", "New York"], ["Spain", "Madrid"], ["Spain", "Madrid"], -4, "customs"),
  },
  {
    tracking_number: "ALX-2026-619355",
    sender: ["Beacon Coffee Roasters", "export@beaconcoffee.example", "+1 (617) 555-0182"],
    receiver: ["Elise Janssens", "elise.janssens@example.com", "+32 470 55 66 77"],
    origin: ["United States", "Boston"],
    destination: ["Belgium", "Antwerp"],
    package_type: "freight",
    weight: 1250,
    packages: 18,
    shipping_service: "business_logistics",
    status: "in_transit",
    current: ["Brussels", "Belgium"],
    createdOffset: -3,
    etaOffset: 5,
    events: chain(
      ["United States", "Boston"],
      ["Belgium", "Brussels"],
      ["Belgium", "Antwerp"],
      -3,
      "in_transit",
    ),
  },
  {
    tracking_number: "ALX-2026-728104",
    sender: ["Marcus Delaney", "marcus.delaney@example.com", "+1 (212) 555-0136"],
    receiver: ["Sean O'Connor", "sean.oconnor@example.com", "+353 85 123 4567"],
    origin: ["United States", "New York"],
    destination: ["Ireland", "Dublin"],
    package_type: "fragile",
    weight: 9.7,
    packages: 2,
    shipping_service: "door_to_door",
    status: "picked_up",
    current: ["New York", "United States"],
    createdOffset: -1,
    etaOffset: 7,
    events: chain(
      ["United States", "New York"],
      ["Ireland", "Dublin"],
      ["Ireland", "Dublin"],
      -1,
      "picked_up",
    ),
  },
  {
    tracking_number: "ALX-2026-845276",
    sender: ["Lone Star Agro", "sales@lonestaragro.example", "+1 (214) 555-0159"],
    receiver: ["Marta Silva", "marta.silva@example.com", "+351 912 345 678"],
    origin: ["United States", "Dallas"],
    destination: ["Portugal", "Lisbon"],
    package_type: "pallet",
    weight: 410,
    packages: 8,
    shipping_service: "cargo_freight",
    status: "pending",
    current: null,
    createdOffset: 0,
    etaOffset: 9,
    events: chain(
      ["United States", "Dallas"],
      ["Portugal", "Lisbon"],
      ["Portugal", "Lisbon"],
      0,
      "pending",
    ),
  },
  {
    tracking_number: "ALX-2026-901488",
    sender: ["Helvetia Parts AG", "dispatch@helvetiaparts.example", "+41 44 500 12 34"],
    receiver: ["Thomas Keller", "thomas.keller@example.com", "+41 79 555 22 11"],
    origin: ["Switzerland", "Zurich"],
    destination: ["France", "Lyon"],
    package_type: "parcel",
    weight: 15.6,
    packages: 3,
    shipping_service: "express_international",
    status: "delivered",
    current: ["Lyon", "France"],
    createdOffset: -10,
    etaOffset: -6,
    events: chain(
      ["Switzerland", "Zurich"],
      ["France", "Paris"],
      ["France", "Lyon"],
      -10,
      "delivered",
    ),
  },
  {
    tracking_number: "ALX-2026-133705",
    sender: ["Northline Retail", "fulfilment@northline.example", "+44 161 555 0182"],
    receiver: ["Ingrid Bakker", "ingrid.bakker@example.com", "+31 6 1188 2200"],
    origin: ["United Kingdom", "Manchester"],
    destination: ["Netherlands", "Utrecht"],
    package_type: "parcel",
    weight: 2.4,
    packages: 1,
    shipping_service: "ecommerce",
    status: "delivered",
    current: ["Utrecht", "Netherlands"],
    createdOffset: -14,
    etaOffset: -10,
    events: chain(
      ["United Kingdom", "Manchester"],
      ["Belgium", "Brussels"],
      ["Netherlands", "Utrecht"],
      -14,
      "delivered",
    ),
  },
  {
    tracking_number: "ALX-2026-664219",
    sender: ["Iberia Wine Co.", "export@iberiawine.example", "+34 954 22 11 00"],
    receiver: ["Julien Girard", "julien.girard@example.com", "+33 6 55 90 12 08"],
    origin: ["Spain", "Seville"],
    destination: ["France", "Bordeaux"],
    package_type: "fragile",
    weight: 64,
    packages: 5,
    shipping_service: "standard_international",
    status: "in_transit",
    current: ["Bilbao", "Spain"],
    createdOffset: -2,
    etaOffset: 3,
    events: chain(
      ["Spain", "Seville"],
      ["Spain", "Madrid"],
      ["France", "Bordeaux"],
      -2,
      "in_transit",
    ),
  },
];

function eventLocationCoords(location: string, country?: string) {
  const city = location.split(",")[0]?.trim();
  return geocodeCity(city, country) ?? { lat: null, lng: null };
}

export interface SeedData {
  users: AppUser[];
  shipments: Shipment[];
  events: TrackingEvent[];
  locations: ServiceLocation[];
  support: SupportRequest[];
}

export function buildSeed(): SeedData {
  const shipments: Shipment[] = [];
  const events: TrackingEvent[] = [];

  BLUEPRINTS.forEach((bp, index) => {
    const id = `shp_${String(index + 1).padStart(4, "0")}`;
    const current = bp.current ? geocodeCity(bp.current[0], bp.current[1]) : null;

    shipments.push({
      id,
      tracking_number: bp.tracking_number,
      sender_name: bp.sender[0],
      sender_email: bp.sender[1],
      sender_phone: bp.sender[2],
      receiver_name: bp.receiver[0],
      receiver_email: bp.receiver[1],
      receiver_phone: bp.receiver[2],
      origin_country: bp.origin[0],
      origin_city: bp.origin[1],
      destination_country: bp.destination[0],
      destination_city: bp.destination[1],
      package_type: bp.package_type,
      weight: bp.weight,
      packages: bp.packages,
      shipping_service: bp.shipping_service,
      status: bp.status,
      current_location: bp.current ? `${bp.current[0]}, ${bp.current[1]}` : null,
      latitude: current?.lat ?? null,
      longitude: current?.lng ?? null,
      estimated_delivery: iso(bp.etaOffset, 17),
      created_at: iso(bp.createdOffset, 8),
      updated_at: iso(Math.min(0, bp.createdOffset + 2), 12),
    });

    bp.events.forEach((ev, evIndex) => {
      const coords = eventLocationCoords(ev.location, ev.country);
      events.push({
        id: `evt_${id}_${String(evIndex + 1).padStart(2, "0")}`,
        shipment_id: id,
        status: ev.status,
        location: ev.location,
        latitude: coords.lat,
        longitude: coords.lng,
        description: ev.description,
        event_date: iso(ev.offsetDays, ev.hour),
        created_at: iso(ev.offsetDays, ev.hour),
      });
    });
  });

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

  const users: AppUser[] = [
    {
      id: "usr_admin",
      name: "AeroLink Operations",
      email: "admin@aerolink.demo",
      phone: "+1 (212) 555-0142",
      role: "admin",
      created_at: iso(-400, 9),
    },
    {
      id: "usr_customer",
      name: "Camille Moreau",
      email: "customer@aerolink.demo",
      phone: "+33 6 12 88 40 21",
      role: "customer",
      created_at: iso(-120, 9),
    },
    ...BLUEPRINTS.slice(0, 8).map((bp, i) => ({
      id: `usr_${i + 1}`,
      name: bp.sender[0],
      email: bp.sender[1],
      phone: bp.sender[2],
      role: "customer" as const,
      created_at: iso(-90 + i * 7, 10),
    })),
  ];

  const support: SupportRequest[] = [
    {
      id: "sup_0001",
      name: "Camille Moreau",
      email: "camille.moreau@example.com",
      phone: "+33 6 12 88 40 21",
      tracking_number: "ALX-2026-983456",
      subject: "Change of delivery address",
      message:
        "I have moved apartments this week. Can the delivery be redirected to the 11th arrondissement?",
      status: "open",
      created_at: iso(-1, 10, 15),
    },
    {
      id: "sup_0002",
      name: "Anne de Vries",
      email: "anne.devries@example.com",
      phone: "+31 6 2244 8899",
      tracking_number: "ALX-2026-338920",
      subject: "Cold chain confirmation",
      message:
        "Please confirm the reefer temperature log for this consignment before it clears customs.",
      status: "in_progress",
      created_at: iso(-2, 14, 40),
    },
    {
      id: "sup_0003",
      name: "Oliver Bennett",
      email: "oliver.bennett@example.com",
      phone: "+44 7700 900211",
      tracking_number: "ALX-2026-114872",
      subject: "Proof of delivery copy",
      message: "Could you email the signed proof of delivery for our records?",
      status: "resolved",
      created_at: iso(-8, 11, 5),
    },
    {
      id: "sup_0004",
      name: "Nadia Brooks",
      email: "nadia.brooks@example.com",
      phone: "+1 (305) 555-0111",
      tracking_number: null,
      subject: "Business account pricing",
      message:
        "We ship roughly 200 parcels a month into Europe and would like volume pricing.",
      status: "open",
      created_at: iso(-3, 9, 30),
    },
  ];

  return { users, shipments, events, locations, support };
}
