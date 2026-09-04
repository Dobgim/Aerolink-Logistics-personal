import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { StatsBand } from "@/components/home/stats-band";
import { ServicesSection } from "@/components/home/services-section";
import { CoverageSection } from "@/components/home/coverage-section";
import { RouteSection } from "@/components/home/route-section";
import { WhyChoose } from "@/components/home/why-choose";
import { BusinessSection } from "@/components/home/business-section";
import { BusinessResource } from "@/components/home/business-resource";
import { SupportSection } from "@/components/home/support-section";
import { SITE } from "@/lib/constants/site";

export const metadata: Metadata = {
  // `absolute` so the layout template does not append the brand a second time.
  title: { absolute: `${SITE.name} — ${SITE.tagline}` },
  description: SITE.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBand />
      <ServicesSection />
      <CoverageSection />
      <RouteSection />
      <WhyChoose />
      <BusinessSection />
      <BusinessResource />
      <SupportSection />
    </>
  );
}
