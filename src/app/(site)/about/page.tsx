import type { Metadata } from "next";
import Image from "next/image";
import { Leaf, Newspaper, Target, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, Container, Section, SectionHeading } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/motion";
import { BLUR_DATA_URL, IMAGES } from "@/lib/constants/images";

export const metadata: Metadata = {
  title: "About AeroLink Logistics",
  description:
    "AeroLink Logistics is an international courier moving express parcels, freight and e-commerce orders worldwide, backed by scan-level tracking.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  {
    Icon: Target,
    title: "Say what is true",
    body: "If a shipment is late we say so, we say why, and we say what the new date is. No silent re-estimates.",
  },
  {
    Icon: Users,
    title: "One team, both ends",
    body: "The same operation owns the shipment from collection to delivery. Nothing is handed to a stranger.",
  },
  {
    Icon: Leaf,
    title: "Load before we fly",
    body: "Consolidated departures and full loads mean fewer flights per tonne moved, and a lower cost per parcel.",
  },
];

const MILESTONES = [
  { year: "2019", title: "Founded", body: "Two vans, one bonded warehouse and a single international lane." },
  { year: "2021", title: "Road linehaul network", body: "Nightly trunking added between hubs, feeding regional depots." },
  { year: "2023", title: "Scan-level tracking", body: "Every hand-off scanned and published to customers in real time." },
  { year: "2026", title: "Multimodal at scale", body: "Air, road and ocean capacity under one tracked network." },
];

const NEWS = [
  {
    date: "August 2026",
    title: "Second daily departure added on our busiest lane",
    body: "Express consignments tendered before 16:00 now make the same-night flight.",
  },
  {
    date: "June 2026",
    title: "Bonded warehousing capacity doubled",
    body: "Freight customers can now hold stock at destination and release it on demand.",
  },
  {
    date: "March 2026",
    title: "Reefer capacity for perishable exports",
    body: "Temperature-controlled handling for perishable and pharmaceutical consignments.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Company"
        title="A courier built for one corridor, done properly"
        description="AeroLink Logistics exists because international shipping was slow, opaque and full of surprises. We rebuilt it around one idea: every hand-off is visible."
        breadcrumbs={[{ label: "Company" }]}
      />

      <Section>
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-ink-900 shadow-lift">
                <Image
                  src={IMAGES.warehouseDark}
                  alt="Pallets stacked in a high-bay logistics warehouse"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={68}
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover"
                />
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="text-2xl font-extrabold sm:text-3xl lg:text-4xl">What we do</h2>
              <p className="mt-4 text-base leading-relaxed text-ink-600 sm:text-lg">
                We collect at the sender&apos;s address, fly daily through our international
                gateways, clear customs on our customers&apos; behalf and deliver to the door.
                Express parcels, palletised freight and e-commerce orders all move through the
                same network — and the same tracking record.
              </p>
              <p className="mt-4 text-base leading-relaxed text-ink-600">
                We are deliberately disciplined. Rather than covering every lane in the world
                badly, we run the lanes we operate properly, with people who know both ends of
                them.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/services" size="md">
                  See our services
                </ButtonLink>
                <ButtonLink href="/contact" size="md" variant="outline">
                  Talk to our team
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section tone="muted">
        <Container>
          <SectionHeading eyebrow="How we work" title="Three things we hold to" align="center" />
          <RevealGroup className="mt-12 grid gap-5 md:grid-cols-3">
            {VALUES.map(({ Icon, title, body }) => (
              <RevealItem key={title}>
                <Card className="h-full">
                  <span className="inline-flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <Icon aria-hidden className="size-6" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-ink-900">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{body}</p>
                </Card>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading eyebrow="History" title="How the network grew" />
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {MILESTONES.map((milestone, i) => (
              <Reveal key={milestone.year} delay={i * 0.08} as="li" className="border-t-2 border-brand-600 pt-5">
                <div>
                  <p className="font-display text-2xl font-extrabold text-brand-800">
                    {milestone.year}
                  </p>
                  <h3 className="mt-2 text-base font-bold text-ink-900">{milestone.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{milestone.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      <Section id="news" tone="muted" className="scroll-mt-28">
        <Container>
          <SectionHeading
            eyebrow="News"
            title="Recent updates"
            description="Network changes that affect transit times and capacity."
          />
          <RevealGroup className="mt-10 grid gap-5 lg:grid-cols-3">
            {NEWS.map((item) => (
              <RevealItem key={item.title}>
                <Card className="h-full">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-brand-700">
                    <Newspaper aria-hidden className="size-3.5" />
                    {item.date}
                  </p>
                  <h3 className="mt-3 text-base font-bold text-ink-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{item.body}</p>
                </Card>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Section id="careers" className="scroll-mt-28">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-2xl font-extrabold sm:text-3xl lg:text-4xl">Careers</h2>
              <p className="mt-4 text-base leading-relaxed text-ink-600 sm:text-lg">
                We hire drivers, warehouse leads, customs specialists and support agents across
                our gateway and depot network. If you have moved freight for a living and care
                about doing it precisely, we would like to hear from you.
              </p>
              <ButtonLink href="/contact?topic=careers" size="lg" className="mt-7">
                Send us your CV
              </ButtonLink>
            </div>

            <div
              id="sustainability"
              className="scroll-mt-28 rounded-2xl border border-ink-200 bg-ink-50 p-6 sm:p-8"
            >
              <h2 className="text-xl font-extrabold sm:text-2xl">Sustainability</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600 sm:text-base">
                Air freight is carbon-heavy and we are not going to pretend otherwise. What we can
                control is load factor and mode. We consolidate departures so aircraft fly full,
                move everything that is not time-critical by sea and road, and run electric vans
                on final-mile rounds where the fleet allows.
              </p>
              <dl className="mt-6 grid grid-cols-2 gap-5">
                <div>
                  <dt className="text-sm font-semibold text-ink-500">Average load factor</dt>
                  <dd className="mt-1 font-display text-2xl font-extrabold text-brand-800">91%</dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-ink-500">EV final-mile rounds</dt>
                  <dd className="mt-1 font-display text-2xl font-extrabold text-brand-800">38%</dd>
                </div>
              </dl>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
