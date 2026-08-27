import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { RevealGroup, RevealItem } from "@/components/ui/motion";
import { SERVICES } from "@/lib/constants/services";
import { BLUR_DATA_URL, IMAGES } from "@/lib/constants/images";

export function ServicesSection() {
  return (
    <Section tone="muted" id="services">
      <Container>
        <SectionHeading
          eyebrow="Our services"
          title="Every kind of shipment, one network"
          description="From a single envelope to a full container load, each service runs on the same tracked network."
          action={
            <ButtonLink href="/services" variant="outline" size="md">
              Compare all services
            </ButtonLink>
          }
        />

        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <RevealItem key={service.slug}>
              <Link
                href={`/services#${service.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-200/80 bg-white shadow-card transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 motion-reduce:hover:translate-y-0"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-ink-900">
                  <Image
                    src={IMAGES[service.image]}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={65}
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-ink-950/70 to-transparent" />
                  <span className="absolute bottom-3 left-4 text-xs font-bold uppercase tracking-[0.12em] text-white/85">
                    {service.transit}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="flex items-start justify-between gap-3 text-lg font-bold text-ink-900">
                    {service.name}
                    <ArrowUpRight
                      aria-hidden
                      className="mt-0.5 size-5 shrink-0 text-ink-400 transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-700"
                    />
                  </h3>
                  <p className="mt-1.5 text-sm font-semibold text-brand-700">{service.tagline}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-600">
                    {service.description}
                  </p>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
