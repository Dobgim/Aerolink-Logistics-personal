import type { ShippingService } from "@/types";
import type { ImageKey } from "./images";

export interface ServiceDefinition {
  slug: ShippingService;
  name: string;
  tagline: string;
  description: string;
  image: ImageKey;
  transit: string;
  weightRange: string;
  features: string[];
}

export const SERVICES: ServiceDefinition[] = [
  {
    slug: "express_international",
    name: "Express International",
    tagline: "Fast international delivery.",
    description:
      "Priority air freight for time-critical parcels and documents, with the earliest available departure and next-flight-out recovery if a connection is missed.",
    image: "aircraftSky",
    transit: "2–4 business days",
    weightRange: "Up to 70 kg per piece",
    features: [
      "Priority handling and customs pre-clearance",
      "Scan-level tracking on every leg",
      "Money-back transit commitment",
      "Signature on delivery included",
    ],
  },
  {
    slug: "standard_international",
    name: "Standard International",
    tagline: "Affordable international shipping.",
    description:
      "Consolidated air and road linehaul for shipments where cost matters more than a day or two. The same tracking, the same network, a lighter rate card.",
    image: "truckHighway",
    transit: "4–8 business days",
    weightRange: "Up to 200 kg per shipment",
    features: [
      "Consolidated departures four times weekly",
      "Duty and tax estimation before you book",
      "Free collection within hub cities",
      "Delivery window notifications",
    ],
  },
  {
    slug: "cargo_freight",
    name: "Cargo & Freight",
    tagline: "Large and heavy shipment solutions.",
    description:
      "Palletised air cargo and full sea-container freight for industrial volumes, including temperature-controlled and oversize consignments.",
    image: "containerShip",
    transit: "6–28 days by mode",
    weightRange: "500 kg to full container load",
    features: [
      "Air, sea and multimodal routing options",
      "Reefer and dangerous-goods handling",
      "Customs brokerage and documentation",
      "Dedicated freight coordinator",
    ],
  },
  {
    slug: "ecommerce",
    name: "E-commerce Delivery",
    tagline: "Delivery solutions for online businesses.",
    description:
      "Pick, pack and ship straight from your storefront. Branded tracking pages, delivery notifications and a returns flow your customers will actually use.",
    image: "packingBox",
    transit: "3–6 business days",
    weightRange: "Up to 30 kg per parcel",
    features: [
      "Bulk label generation and manifesting",
      "Automated status notifications",
      "Simple returns and refused-parcel handling",
      "Volume pricing from 50 parcels a month",
    ],
  },
  {
    slug: "business_logistics",
    name: "Business Logistics",
    tagline: "Solutions for companies shipping internationally.",
    description:
      "Account-managed logistics for exporters and distributors — scheduled collections, warehousing at both ends of the lane, and one consolidated monthly invoice.",
    image: "warehouse",
    transit: "Scheduled to your plan",
    weightRange: "Contract volumes",
    features: [
      "Named account manager",
      "Scheduled daily or weekly collections",
      "Bonded warehousing at origin and destination",
      "Consolidated invoicing and reporting",
    ],
  },
  {
    slug: "door_to_door",
    name: "Door-to-Door Delivery",
    tagline: "Pickup and delivery from address to address.",
    description:
      "We collect at the sender's address, clear customs on the receiver's behalf and hand the shipment over at the door — no depot visits at either end.",
    image: "handover",
    transit: "3–7 business days",
    weightRange: "Up to 100 kg per shipment",
    features: [
      "Collection booked online or by phone",
      "Customs clearance handled for you",
      "Delivery appointment windows",
      "Proof of delivery with signature",
    ],
  },
];

export function serviceBySlug(slug: string): ServiceDefinition | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
