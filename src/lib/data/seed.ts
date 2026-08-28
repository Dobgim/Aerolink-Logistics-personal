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

interface Party {
  name: string;
  company?: string;
  email: string;
  phone: string;
  city: string;
  state?: string;
  country: string;
}

interface ShipmentBlueprint {
  tracking_number: string;
  order_number: string;
  sender: Party;
  receiver: Party;
  goods: string;
  cargo?: Shipment["cargo_type"];
  money: { declared: number; freight: number; insurance: number; tax: number };
  paid?: boolean;
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
      description: "Package picked up by a Royal Prime courier.",
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
    tracking_number: "RPL-2026-983456",
    order_number: "ORD-2026-1810111",
    sender: { name: "Daniel Whitfield", email: "daniel.whitfield@example.com", phone: "+1 (212) 555-0117", city: "New York", state: "NY", country: "United States" },
    receiver: { name: "Camille Moreau", email: "camille.moreau@example.com", phone: "+33 6 12 88 40 21", city: "Paris", state: "Île-de-France", country: "France" },
    origin: ["United States", "New York"],
    destination: ["France", "Paris"],
    goods: "Assorted retail apparel",
    cargo: "car",
    money: { declared: 514.41, freight: 90.7, insurance: 6.17, tax: 19.37 },
    paid: true,
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
    tracking_number: "RPL-2026-114872",
    order_number: "ORD-2026-7135241",
    sender: { name: "Brightline Logistics LLC", company: "Brightline Logistics LLC", email: "ops@brightlinelogistics.example", phone: "+1 (312) 555-0164", city: "Chicago", state: "IL", country: "United States" },
    receiver: { name: "Oliver Bennett", email: "oliver.bennett@example.com", phone: "+44 7700 900211", city: "London", state: "Greater London", country: "United Kingdom" },
    origin: ["United States", "Chicago"],
    destination: ["United Kingdom", "London"],
    goods: "Printed commercial documents",
    cargo: "van",
    money: { declared: 266.92, freight: 41.4, insurance: 3.2, tax: 8.92 },
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
    tracking_number: "RPL-2026-550193",
    order_number: "ORD-2026-4602037",
    sender: { name: "Atlas Textiles Inc.", company: "Atlas Textiles Inc.", email: "export@atlastextiles.example", phone: "+1 (212) 555-0193", city: "New York", state: "NY", country: "United States" },
    receiver: { name: "Sofia Rossi", email: "sofia.rossi@example.com", phone: "+39 340 118 2277", city: "Milan", state: "Lombardia", country: "Italy" },
    origin: ["United States", "New York"],
    destination: ["Italy", "Milan"],
    goods: "Woven textile rolls",
    cargo: "truck",
    money: { declared: 8996.57, freight: 1058.0, insurance: 107.96, tax: 233.19 },
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
    tracking_number: "RPL-2026-206741",
    order_number: "ORD-2026-2171979",
    sender: { name: "Rachel Adeyemi", email: "rachel.adeyemi@example.com", phone: "+1 (404) 555-0148", city: "Atlanta", state: "GA", country: "United States" },
    receiver: { name: "Lukas Weber", email: "lukas.weber@example.com", phone: "+49 151 2233 4455", city: "Berlin", state: "Berlin", country: "Germany" },
    origin: ["United States", "Atlanta"],
    destination: ["Germany", "Berlin"],
    goods: "Consumer electronics accessories",
    cargo: "plane",
    money: { declared: 378.7, freight: 64.35, insurance: 4.54, tax: 13.78 },
    paid: true,
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
    tracking_number: "RPL-2026-338920",
    order_number: "ORD-2026-1991709",
    sender: { name: "Harborline Seafoods", company: "Harborline Seafoods", email: "logistics@harborlineseafoods.example", phone: "+1 (617) 555-0129", city: "New York", state: "NY", country: "United States" },
    receiver: { name: "Anne de Vries", email: "anne.devries@example.com", phone: "+31 6 2244 8899", city: "Rotterdam", state: "Zuid-Holland", country: "Netherlands" },
    origin: ["United States", "New York"],
    destination: ["Netherlands", "Rotterdam"],
    goods: "Chilled seafood, temperature controlled",
    cargo: "ship",
    money: { declared: 2704.52, freight: 414.12, insurance: 32.45, tax: 89.31 },
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
    tracking_number: "RPL-2026-472018",
    order_number: "ORD-2026-4745328",
    sender: { name: "Nova Commerce", company: "Nova Commerce", email: "ship@novacommerce.example", phone: "+1 (646) 555-0175", city: "New York", state: "NY", country: "United States" },
    receiver: { name: "Diego Fernández", email: "diego.fernandez@example.com", phone: "+34 611 22 33 44", city: "Madrid", state: "Comunidad de Madrid", country: "Spain" },
    origin: ["United States", "New York"],
    destination: ["Spain", "Madrid"],
    goods: "Online order — household goods",
    cargo: "package",
    money: { declared: 213.94, freight: 51.17, insurance: 2.57, tax: 10.75 },
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
    tracking_number: "RPL-2026-619355",
    order_number: "ORD-2026-2037872",
    sender: { name: "Beacon Coffee Roasters", company: "Beacon Coffee Roasters", email: "export@beaconcoffee.example", phone: "+1 (617) 555-0182", city: "Boston", state: "MA", country: "United States" },
    receiver: { name: "Elise Janssens", email: "elise.janssens@example.com", phone: "+32 470 55 66 77", city: "Antwerp", state: "Antwerpen", country: "Belgium" },
    origin: ["United States", "Boston"],
    destination: ["Belgium", "Antwerp"],
    goods: "Roasted coffee, 24 sacks",
    cargo: "motorbike",
    money: { declared: 35883.04, freight: 5350.5, insurance: 430.6, tax: 1156.22 },
    paid: true,
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
    tracking_number: "RPL-2026-728104",
    order_number: "ORD-2026-4709137",
    sender: { name: "Marcus Delaney", email: "marcus.delaney@example.com", phone: "+1 (212) 555-0136", city: "New York", state: "NY", country: "United States" },
    receiver: { name: "Sean O'Connor", email: "sean.oconnor@example.com", phone: "+353 85 123 4567", city: "Dublin", state: "County Dublin", country: "Ireland" },
    origin: ["United States", "New York"],
    destination: ["Ireland", "Dublin"],
    goods: "Ceramic homeware, fragile",
    cargo: "car",
    money: { declared: 450.11, freight: 79.22, insurance: 5.4, tax: 16.92 },
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
    tracking_number: "RPL-2026-845276",
    order_number: "ORD-2026-5858837",
    sender: { name: "Lone Star Agro", company: "Lone Star Agro", email: "sales@lonestaragro.example", phone: "+1 (214) 555-0159", city: "Dallas", state: "TX", country: "United States" },
    receiver: { name: "Marta Silva", email: "marta.silva@example.com", phone: "+351 912 345 678", city: "Lisbon", state: "Lisboa", country: "Portugal" },
    origin: ["United States", "Dallas"],
    destination: ["Portugal", "Lisbon"],
    goods: "Packaged dry foodstuffs",
    cargo: "van",
    money: { declared: 14638.52, freight: 1780.5, insurance: 175.66, tax: 391.23 },
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
    tracking_number: "RPL-2026-901488",
    order_number: "ORD-2026-6175466",
    sender: { name: "Helvetia Parts AG", email: "dispatch@helvetiaparts.example", phone: "+41 44 500 12 34", city: "Zurich", state: "Zürich", country: "Switzerland" },
    receiver: { name: "Thomas Keller", email: "thomas.keller@example.com", phone: "+41 79 555 22 11", city: "Lyon", state: "Auvergne-Rhône-Alpes", country: "France" },
    origin: ["Switzerland", "Zurich"],
    destination: ["France", "Lyon"],
    goods: "Precision machine parts",
    cargo: "truck",
    money: { declared: 675.21, freight: 104.3, insurance: 8.1, tax: 22.48 },
    paid: true,
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
    tracking_number: "RPL-2026-133705",
    order_number: "ORD-2026-2728987",
    sender: { name: "Northline Retail", company: "Northline Retail", email: "fulfilment@northline.example", phone: "+44 161 555 0182", city: "Manchester", state: "Greater Manchester", country: "United Kingdom" },
    receiver: { name: "Ingrid Bakker", email: "ingrid.bakker@example.com", phone: "+31 6 1188 2200", city: "Utrecht", state: "Utrecht", country: "Netherlands" },
    origin: ["United Kingdom", "Manchester"],
    destination: ["Netherlands", "Utrecht"],
    goods: "Online order — apparel",
    cargo: "plane",
    money: { declared: 349.5, freight: 48.2, insurance: 4.19, tax: 10.48 },
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
    tracking_number: "RPL-2026-664219",
    order_number: "ORD-2026-7247794",
    sender: { name: "Iberia Wine Co.", company: "Iberia Wine Co.", email: "export@iberiawine.example", phone: "+34 954 22 11 00", city: "Seville", state: "Andalucía", country: "Spain" },
    receiver: { name: "Julien Girard", email: "julien.girard@example.com", phone: "+33 6 55 90 12 08", city: "Bordeaux", state: "Nouvelle-Aquitaine", country: "France" },
    origin: ["Spain", "Seville"],
    destination: ["France", "Bordeaux"],
    goods: "Bottled wine, 60 units",
    cargo: "ship",
    money: { declared: 2174.35, freight: 310.0, insurance: 26.09, tax: 67.22 },
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
      order_number: bp.order_number,

      sender_name: bp.sender.name,
      sender_company: bp.sender.company ?? null,
      sender_email: bp.sender.email,
      sender_phone: bp.sender.phone,
      sender_city: bp.sender.city,
      sender_state: bp.sender.state ?? null,
      sender_country: bp.sender.country,

      receiver_name: bp.receiver.name,
      receiver_company: bp.receiver.company ?? null,
      receiver_email: bp.receiver.email,
      receiver_phone: bp.receiver.phone,
      receiver_city: bp.receiver.city,
      receiver_state: bp.receiver.state ?? null,
      receiver_country: bp.receiver.country,

      origin_country: bp.origin[0],
      origin_city: bp.origin[1],
      destination_country: bp.destination[0],
      destination_city: bp.destination[1],
      package_type: bp.package_type,
      weight: bp.weight,
      packages: bp.packages,
      shipping_service: bp.shipping_service,
      goods_description: bp.goods,
      cargo_image_url: null,
      cargo_type: bp.cargo ?? "package",

      ship_date: iso(bp.createdOffset + 1, 9),

      currency: "USD",
      declared_value: bp.money.declared,
      freight_cost: bp.money.freight,
      insurance_cost: bp.money.insurance,
      tax_amount: bp.money.tax,
      payment_status: bp.paid ? "paid" : "unpaid",

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
      name: "Royal Prime Operations",
      email: "admin@royalprime.demo",
      phone: "+1 (212) 555-0142",
      role: "admin",
      created_at: iso(-400, 9),
    },
    {
      id: "usr_customer",
      name: "Camille Moreau",
      email: "customer@royalprime.demo",
      phone: "+33 6 12 88 40 21",
      role: "customer",
      created_at: iso(-120, 9),
    },
    ...BLUEPRINTS.slice(0, 8).map((bp, i) => ({
      id: `usr_${i + 1}`,
      name: bp.sender.name,
      email: bp.sender.email,
      phone: bp.sender.phone,
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
      tracking_number: "RPL-2026-983456",
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
      tracking_number: "RPL-2026-338920",
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
      tracking_number: "RPL-2026-114872",
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
