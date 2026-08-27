export const SITE = {
  name: "AeroLink Logistics",
  shortName: "AeroLink",
  tagline: "Ship Anywhere. Track Everything.",
  description:
    "Reliable international shipping with real-time shipment tracking from pickup to delivery. AeroLink Logistics moves express parcels, freight and e-commerce orders worldwide.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://aerolink-logistics.vercel.app",
  email: "support@aerolink-logistics.com",
  salesEmail: "business@aerolink-logistics.com",
  /*
   * Numbers use the 555-01xx range, which is reserved for fictional use, so
   * this demo brand can never route a call to a real subscriber.
   */
  phone: "+1 (212) 555-0142",
  phoneHref: "+12125550142",
  supportPhone: "+1 (800) 555-0188",
  supportPhoneHref: "+18005550188",
  address: "1200 Harbor Point Drive, Jersey City, NJ 07305, United States",
  hours: "Mon–Fri 07:00–19:00 · Sat 08:00–14:00 (ET)",
  social: {
    x: "https://x.com/",
    linkedin: "https://www.linkedin.com/",
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
  },
} as const;

export const NAV_LINKS = [
  { label: "Shipping", href: "/shipping" },
  { label: "Tracking", href: "/tracking" },
  { label: "Services", href: "/services" },
  { label: "Network", href: "/locations" },
  { label: "Company", href: "/about" },
  { label: "Support", href: "/contact" },
] as const;

export const SAMPLE_TRACKING_NUMBER = "ALX-2026-983456";
