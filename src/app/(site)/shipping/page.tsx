import type { Metadata } from "next";
import Image from "next/image";
import { CalendarCheck, FileText, PackageCheck, Truck } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, Container, Section, SectionHeading } from "@/components/ui/primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/motion";
import { CollectionForm } from "@/components/shipping/collection-form";
import { BLUR_DATA_URL, IMAGES } from "@/lib/constants/images";

export const metadata: Metadata = {
  title: "Ship Now",
  description:
    "Book an international collection with FreightCargoXpress — tell us the route, the contents and the weight, and we confirm the rate and a pickup window.",
  alternates: { canonical: "/shipping" },
};

const STEPS = [
  {
    Icon: FileText,
    title: "Tell us the shipment",
    body: "Route, contents, weight and how soon it is ready. Two minutes, no account needed.",
  },
  {
    Icon: CalendarCheck,
    title: "We confirm rate and slot",
    body: "You get the price, the transit time and a collection window by email — usually the same day.",
  },
  {
    Icon: Truck,
    title: "We collect",
    body: "Our courier collects from the address and the shipment gets its first tracking scan.",
  },
  {
    Icon: PackageCheck,
    title: "Track to the door",
    body: "Every hand-off is scanned through to delivery and signature at the destination address.",
  },
];

const DELIVERY_INFO = [
  {
    title: "Transit times",
    body: "Express runs 2–4 business days between gateways; standard 4–8; sea freight 18–28. Clocks start at the first collection scan, not at booking.",
  },
  {
    title: "Customs and duties",
    body: "We clear import on the receiver's behalf. Duties and VAT are set by the destination authority and are payable by the receiver unless the sender elects to pay them at booking.",
  },
  {
    title: "Restricted goods",
    body: "We cannot carry cash, precious stones, live animals, or anything prohibited by the destination country. Dangerous goods move only under a declared DG booking.",
  },
  {
    title: "Delivery attempts",
    body: "We attempt delivery twice on consecutive working days, then hold the shipment at the local service point for five days before returning it.",
  },
  {
    title: "Proof of delivery",
    body: "Every delivery is signed for. A signed proof of delivery is available on request for any shipment within twelve months.",
  },
  {
    title: "Claims",
    body: "Report damage or loss within seven days of the delivery date. Standard transit liability applies unless additional cover was purchased at booking.",
  },
];

interface PageProps {
  searchParams: Promise<{ service?: string }>;
}

export default async function ShippingPage({ searchParams }: PageProps) {
  const { service } = await searchParams;

  return (
    <>
      <PageHeader
        eyebrow="Ship now"
        title="Book an international collection"
        description="Tell us what is moving and where it needs to be. We come back with the rate, the transit time and a pickup window."
        breadcrumbs={[{ label: "Shipping" }]}
      />

      <Section tone="muted" className="py-12 sm:py-16">
        <Container>
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ Icon, title, body }, i) => (
              <RevealItem key={title}>
                <Card className="h-full">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                      <Icon aria-hidden className="size-5" />
                    </span>
                    <span className="font-display text-sm font-extrabold text-ink-400">
                      0{i + 1}
                    </span>
                  </div>
                  <h2 className="mt-4 text-base font-bold text-ink-900">{title}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{body}</p>
                </Card>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Section className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-10">
            <div>
              <h2 className="text-2xl font-extrabold sm:text-3xl">Collection request</h2>
              <p className="mt-2 max-w-xl text-sm text-ink-600 sm:text-base">
                Nothing is charged at this step — you confirm once we send the rate.
              </p>
              <div className="mt-6">
                <CollectionForm defaultService={service} />
              </div>
            </div>

            <Reveal delay={0.1} className="lg:sticky lg:top-28 lg:self-start">
              <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-ink-900 shadow-lift">
                <Image
                  src={IMAGES.loadedVan}
                  alt="A delivery van loaded with parcels ready for a collection round"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  quality={68}
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section id="delivery" tone="muted" className="scroll-mt-28">
        <Container>
          <SectionHeading
            eyebrow="Delivery information"
            title="The details worth reading before you book"
            description="Transit commitments, customs handling and what happens if something goes wrong."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {DELIVERY_INFO.map((item) => (
              <Card key={item.title} className="h-full">
                <h3 className="text-base font-bold text-ink-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{item.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
