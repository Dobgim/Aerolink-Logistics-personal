import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, Section } from "@/components/ui/primitives";
import { RevealGroup, RevealItem } from "@/components/ui/motion";
import { BLUR_DATA_URL, IMAGES, type ImageKey } from "@/lib/constants/images";
import { SITE } from "@/lib/constants/site";

interface ResourceCard {
  image: ImageKey;
  alt: string;
  title: string;
  body: string;
  cta: string;
  href: string;
}

const CARDS: ResourceCard[] = [
  {
    image: "packingBox",
    alt: "Hands sealing a cardboard parcel ready for collection",
    title: `New to ${SITE.shortName}?`,
    body: `Our new customer centre walks you through every step of preparing, booking and sending your first shipment with ${SITE.name}.`,
    cta: "Let us help",
    href: "/shipping",
  },
  {
    image: "business",
    alt: "Two colleagues reviewing shipping volumes on a laptop",
    title: `Open a ${SITE.shortName} account`,
    body: "Benefit from services and solutions built around how you actually ship. Create an account and get volume pricing, scheduled collections and one monthly invoice.",
    cta: "Let's get started",
    href: "/register",
  },
  {
    image: "aircraftSky",
    alt: "An aircraft climbing through cloud on an international departure",
    title: "International Shipping Services",
    body: "Choose from express, standard, freight and door-to-door options, and find the best fit for your international shipments.",
    cta: "Learn more",
    href: "/services",
  },
];

export function BusinessResource() {
  return (
    <Section tone="muted">
      <Container>
        <h2 className="text-center text-3xl font-extrabold leading-[1.1] sm:text-4xl lg:text-[2.75rem]">
          Your Business Resource
        </h2>

        <RevealGroup className="mt-12 grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-10">
          {CARDS.map((card) => (
            <RevealItem key={card.title}>
              <article className="flex h-full flex-col text-center">
                <Link
                  href={card.href}
                  tabIndex={-1}
                  aria-hidden
                  className="group relative block aspect-16/10 overflow-hidden rounded-xl bg-ink-900 shadow-card"
                >
                  <Image
                    src={IMAGES[card.image]}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    quality={68}
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100"
                  />
                </Link>

                <h3 className="mt-6 text-xl font-bold text-ink-900 sm:text-2xl">{card.title}</h3>
                <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-ink-600">
                  {card.body}
                </p>

                <Link
                  href={card.href}
                  className="mt-5 inline-flex items-center justify-center gap-1.5 self-center text-sm font-bold uppercase tracking-[0.08em] text-brand-700 transition-colors hover:text-brand-900"
                >
                  {card.cta}
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
