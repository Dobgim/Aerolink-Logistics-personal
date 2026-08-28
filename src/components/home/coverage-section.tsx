import Image from "next/image";
import { Building2, Clock, PackageCheck, Plane, Ship, Truck } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/motion";
import { BLUR_DATA_URL, IMAGES } from "@/lib/constants/images";

/**
 * Coverage is described by capability rather than by a published country list —
 * lanes and service areas change, and a stale list on a marketing page is worse
 * than none at all. Customers confirm their own address in the finder.
 */
const CAPABILITIES = [
  {
    Icon: Plane,
    title: "Air gateways",
    body: "Daily departures through our international gateways, with next-flight-out recovery when a connection slips.",
  },
  {
    Icon: Truck,
    title: "Road linehaul",
    body: "Scheduled trunking between hubs, feeding regional depots and final-mile rounds every night.",
  },
  {
    Icon: Ship,
    title: "Ocean freight",
    body: "Full and shared container loads for volumes that do not need to fly.",
  },
  {
    Icon: Building2,
    title: "Staffed service points",
    body: "Counters for drop-off, collection and paperwork in every hub city we operate.",
  },
  {
    Icon: PackageCheck,
    title: "Address-level delivery",
    body: "Rounds reach far past the hub cities — if an address receives post, we can usually reach it.",
  },
  {
    Icon: Clock,
    title: "Published transit times",
    body: "Every service quotes a transit window before you book, measured from the first collection scan.",
  },
];

export function CoverageSection() {
  return (
    <Section id="coverage">
      <Container>
        <SectionHeading
          eyebrow="Our network"
          title="Built to reach the address, not just the city"
          description="Rather than publishing a fixed list of destinations, we quote your exact lane when you book — and the finder confirms the nearest service point to any address."
          action={
            <ButtonLink href="/locations" variant="outline" size="md">
              Find a service point
            </ButtonLink>
          }
        />

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
          <RevealGroup className="grid gap-5 sm:grid-cols-2">
            {CAPABILITIES.map(({ Icon, title, body }) => (
              <RevealItem key={title}>
                <div className="h-full rounded-2xl border border-ink-200/80 bg-white p-5 shadow-card">
                  <span className="inline-flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                    <Icon aria-hidden className="size-5" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-ink-900">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.1}>
            <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-ink-900 shadow-lift sm:aspect-4/3 lg:aspect-4/5">
              <Image
                src={IMAGES.courierDolly}
                alt="A courier moving a loaded hand truck of parcels along a delivery round"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                quality={68}
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover object-[50%_45%]"
              />
              <div className="absolute inset-0 bg-linear-to-t from-ink-950/85 via-ink-950/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-sm font-semibold text-brand-200">Final mile</p>
                <p className="mt-1.5 text-lg font-bold leading-snug text-white">
                  Consignments are scanned at every hand-off, from ramp to doorstep.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
