import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants/site";
import { EUROPE } from "@/lib/constants/geo";
import { SERVICES } from "@/lib/constants/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const core: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/tracking`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE.url}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/locations`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE.url}/shipping`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE.url}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE.url}/login`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE.url}/register`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const legal: MetadataRoute.Sitemap = ["privacy", "terms", "cookies"].map((slug) => ({
    url: `${SITE.url}/legal/${slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.2,
  }));

  const countries: MetadataRoute.Sitemap = EUROPE.map((country) => ({
    url: `${SITE.url}/locations?country=${encodeURIComponent(country.country)}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const services: MetadataRoute.Sitemap = SERVICES.map((service) => ({
    url: `${SITE.url}/services#${service.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...core, ...services, ...countries, ...legal];
}
