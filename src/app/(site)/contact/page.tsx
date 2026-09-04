import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, MapPin, PhoneCall } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, Container, Section } from "@/components/ui/primitives";
import { SupportForm } from "@/components/contact/support-form";
import { SITE } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: "Contact Support",
  description:
    "Reach the FreightCargoXpress support team about a shipment, a quote, customs paperwork or a business account.",
  alternates: { canonical: "/contact" },
};

const FAQS = [
  {
    q: "How soon does a new shipment appear in tracking?",
    a: "As soon as the shipment is created it gets its first scan. Collection scans usually follow within a few hours of pickup.",
  },
  {
    q: "Why has my shipment been sitting in customs?",
    a: "Import clearance depends on the destination authority. Most consignments clear within 24–48 hours; missing paperwork is the usual cause of a longer hold, and we will contact you if anything is needed.",
  },
  {
    q: "Can I change the delivery address after collection?",
    a: "Usually yes, if the shipment has not yet been loaded for final delivery. Send us the tracking number and the new address and we will confirm.",
  },
  {
    q: "Do you deliver to towns outside the listed cities?",
    a: "Yes. Our service points are in the cities, but delivery rounds cover the surrounding towns and villages.",
  },
  {
    q: "Is my shipment insured?",
    a: "Every shipment carries standard transit liability. Higher declared-value cover can be added when the shipment is booked.",
  },
];

interface PageProps {
  searchParams: Promise<{ topic?: string; number?: string }>;
}

export default async function ContactPage({ searchParams }: PageProps) {
  const { topic, number } = await searchParams;

  const defaultSubject =
    topic === "business"
      ? "Business account enquiry"
      : topic === "quote"
        ? "Request a quote"
        : undefined;

  return (
    <>
      <PageHeader
        eyebrow="Support"
        title="Need Help With Your Shipment?"
        description="Our logistics team handles shipment questions, customs paperwork, delivery changes and claims directly."
        breadcrumbs={[{ label: "Support" }]}
      />

      <Section tone="muted">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-10">
            <div id="help" className="scroll-mt-28">
              <h2 className="text-xl font-extrabold sm:text-2xl">Send us a message</h2>
              <p className="mt-2 max-w-xl text-sm text-ink-600 sm:text-base">
                Every message opens a support request that our team works through in order. Include
                a tracking number where you have one.
              </p>
              <div className="mt-6">
                <SupportForm defaultSubject={defaultSubject} defaultTrackingNumber={number} />
              </div>
            </div>

            <aside className="space-y-4">
              <Card>
                <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-ink-500">
                  Talk to us
                </h2>
                <ul className="mt-4 space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                    <PhoneCall aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-700" />
                    <div>
                      <p className="font-semibold text-ink-900">Main line</p>
                      <a
                        href={`tel:${SITE.phoneHref}`}
                        className="text-ink-600 underline-offset-2 hover:text-brand-700 hover:underline"
                      >
                        {SITE.phone}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <PhoneCall aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-700" />
                    <div>
                      <p className="font-semibold text-ink-900">Toll free</p>
                      <a
                        href={`tel:${SITE.supportPhoneHref}`}
                        className="text-ink-600 underline-offset-2 hover:text-brand-700 hover:underline"
                      >
                        {SITE.supportPhone}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Mail aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-700" />
                    <div>
                      <p className="font-semibold text-ink-900">Email</p>
                      <a
                        href={`mailto:${SITE.email}`}
                        className="break-all text-ink-600 underline-offset-2 hover:text-brand-700 hover:underline"
                      >
                        {SITE.email}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-700" />
                    <div>
                      <p className="font-semibold text-ink-900">Opening hours</p>
                      <p className="text-ink-600">{SITE.hours}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-700" />
                    <div>
                      <p className="font-semibold text-ink-900">Head office</p>
                      <p className="text-ink-600">{SITE.address}</p>
                      <Link
                        href="/locations"
                        className="mt-1 inline-block font-semibold text-brand-700 hover:text-brand-900"
                      >
                        Find a service point
                      </Link>
                    </div>
                  </li>
                </ul>
              </Card>

              <Card tone="brand">
                <h2 className="text-base font-bold text-white">Tracking a shipment?</h2>
                <p className="mt-2 text-sm text-brand-200">
                  Most questions are answered by the tracking page — it shows every scan, the
                  current location and the delivery estimate.
                </p>
                <Link
                  href="/tracking"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-white underline underline-offset-4"
                >
                  Open shipment tracking
                </Link>
              </Card>
            </aside>
          </div>
        </Container>
      </Section>

      <Section id="faqs" className="scroll-mt-28">
        <Container>
          <h2 className="text-2xl font-extrabold sm:text-3xl">Frequently asked questions</h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-ink-200 bg-white p-5 shadow-card open:shadow-lift"
              >
                <summary className="cursor-pointer list-none text-base font-bold text-ink-900 marker:hidden">
                  <span className="flex items-start justify-between gap-4">
                    {faq.q}
                    <span
                      aria-hidden
                      className="mt-1 shrink-0 text-ink-400 transition-transform duration-200 group-open:rotate-45"
                    >
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
