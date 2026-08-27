import type { Metadata } from "next";
import Image from "next/image";
import { Check, Clock, Scale } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Container, Section } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/motion";
import { SERVICES } from "@/lib/constants/services";
import { BLUR_DATA_URL, IMAGES } from "@/lib/constants/images";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = {
  title: "Shipping Services",
  description:
    "Express and standard international shipping, cargo and freight, e-commerce delivery, business logistics and door-to-door delivery.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Shipping services built around the shipment"
        description="Six ways to move goods internationally. Same network, same tracking, different speed and price."
        breadcrumbs={[{ label: "Services" }]}
      />

      <Section>
        <Container>
          <div className="space-y-16 sm:space-y-24">
            {SERVICES.map((service, index) => (
              <Reveal key={service.slug}>
                <article
                  id={service.slug}
                  className="grid scroll-mt-28 items-center gap-8 lg:grid-cols-2 lg:gap-14"
                >
                  <div
                    className={cn(
                      "relative aspect-16/10 overflow-hidden rounded-2xl bg-ink-900 shadow-lift",
                      index % 2 === 1 && "lg:order-2",
                    )}
                  >
                    <Image
                      src={IMAGES[service.image]}
                      alt={`${service.name} — AeroLink Logistics`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      quality={68}
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <h2 className="text-2xl font-extrabold sm:text-3xl">{service.name}</h2>
                    <p className="mt-2 text-base font-semibold text-brand-700">
                      {service.tagline}
                    </p>
                    <p className="mt-4 text-base leading-relaxed text-ink-600">
                      {service.description}
                    </p>

                    <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
                      <div className="flex items-center gap-2">
                        <Clock aria-hidden className="size-4 text-ink-400" />
                        <dt className="sr-only">Typical transit</dt>
                        <dd className="text-sm font-semibold text-ink-800">{service.transit}</dd>
                      </div>
                      <div className="flex items-center gap-2">
                        <Scale aria-hidden className="size-4 text-ink-400" />
                        <dt className="sr-only">Weight range</dt>
                        <dd className="text-sm font-semibold text-ink-800">
                          {service.weightRange}
                        </dd>
                      </div>
                    </dl>

                    <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <Check
                            aria-hidden
                            className="mt-0.5 size-4 shrink-0 text-emerald-600"
                          />
                          <span className="text-sm text-ink-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <ButtonLink href={`/shipping?service=${service.slug}`} size="md">
                        Get a quote
                      </ButtonLink>
                      <ButtonLink href="/contact" size="md" variant="outline">
                        Ask a question
                      </ButtonLink>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="muted">
        <Container>
          <div className="rounded-2xl border border-ink-200 bg-white p-6 text-center shadow-card sm:p-10">
            <h2 className="text-2xl font-extrabold sm:text-3xl">Not sure which service fits?</h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-ink-600">
              Tell us what you are shipping, where it is going and when it needs to land. We will
              come back with the routing and the rate.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href="/contact?topic=quote" size="lg">
                Request a quote
              </ButtonLink>
              <ButtonLink href="/tracking" size="lg" variant="outline">
                Track a shipment
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
