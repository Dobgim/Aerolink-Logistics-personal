import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/layout/page-header";
import { Card, Container, Section } from "@/components/ui/primitives";
import { LocationsExplorer } from "@/components/locations/locations-explorer";
import { listLocations } from "@/lib/data/repository";
import { BLUR_DATA_URL, IMAGES } from "@/lib/constants/images";

export const metadata: Metadata = {
  title: "Find a Service Point",
  description:
    "Search for the nearest FreightCargoXpress service point by city, town or address, and see how our gateway and delivery network is laid out.",
  alternates: { canonical: "/locations" },
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function LocationsPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const locations = await listLocations();

  return (
    <>
      <PageHeader
        eyebrow="Network"
        title="Find a service point"
        description="Staffed counters for drop-off, collection and paperwork — and a delivery network that reaches far beyond them."
        breadcrumbs={[{ label: "Network" }]}
      />

      <Section tone="muted" className="py-10 sm:py-14">
        <Container>
          <LocationsExplorer locations={locations} initialQuery={q ?? ""} />
        </Container>
      </Section>

      <Section id="coverage" className="scroll-mt-28">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-ink-900 shadow-lift">
              <Image
                src={IMAGES.europeAerial}
                alt="Aerial view of a dense city with rooftops and narrow streets"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={68}
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover"
              />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold sm:text-3xl lg:text-4xl">
                Delivery beyond the counter
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-600 sm:text-lg">
                Our service points sit in the hub cities, but our delivery rounds reach far past
                them. We do not publish a fixed list of destinations, because lanes and transit
                times change — instead, every booking is quoted against the exact address you are
                shipping to.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <Card tone="muted" className="shadow-none">
                  <h3 className="text-sm font-bold text-ink-900">Not sure we reach you?</h3>
                  <p className="mt-1.5 text-sm text-ink-600">
                    Search above, or send us the postcode and we will confirm the same day.
                  </p>
                </Card>
                <Card tone="muted" className="shadow-none">
                  <h3 className="text-sm font-bold text-ink-900">Need a collection instead?</h3>
                  <p className="mt-1.5 text-sm text-ink-600">
                    Book a pickup from your own address — no counter visit needed.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
