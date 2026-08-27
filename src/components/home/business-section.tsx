import Image from "next/image";
import { Boxes, FileSpreadsheet, PackageCheck, Ship, Store } from "lucide-react";
import { Container, Eyebrow, Section } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/motion";
import { BLUR_DATA_URL, IMAGES } from "@/lib/constants/images";

const CAPABILITIES = [
  { Icon: Boxes, title: "Bulk shipments", body: "Manifest hundreds of parcels in one upload." },
  { Icon: FileSpreadsheet, title: "Business accounts", body: "Credit terms and one monthly invoice." },
  { Icon: Store, title: "E-commerce delivery", body: "Storefront to doorstep with branded tracking." },
  { Icon: Ship, title: "International freight", body: "Air, sea and multimodal for heavy cargo." },
  {
    Icon: PackageCheck,
    title: "Shipment management",
    body: "One dashboard for every consignment in flight.",
  },
];

export function BusinessSection() {
  return (
    <Section>
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="order-2 lg:order-1">
            <Eyebrow>For business</Eyebrow>
            <h2 className="mt-3 text-3xl font-extrabold leading-[1.1] sm:text-4xl lg:text-[2.75rem]">
              Logistics Built for Growing Businesses
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-600 sm:text-lg">
              Whether you ship fifty parcels a month or move pallets every week, your account comes
              with the tooling, the pricing and the named contact to make it predictable.
            </p>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {CAPABILITIES.map(({ Icon, title, body }) => (
                <li key={title} className="flex gap-3">
                  <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                    <Icon aria-hidden className="size-4.5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink-900">{title}</p>
                    <p className="mt-0.5 text-sm text-ink-600">{body}</p>
                  </div>
                </li>
              ))}
            </ul>

            <ButtonLink href="/contact?topic=business" size="lg" className="mt-9">
              Talk to Our Team
            </ButtonLink>
          </Reveal>

          <Reveal className="order-1 lg:order-2" y={32}>
            <div className="relative">
              <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-ink-900 shadow-lift sm:aspect-3/2 lg:aspect-4/3">
                <Image
                  src={IMAGES.business}
                  alt="Two colleagues reviewing shipping volumes together in an office"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={68}
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover"
                />
              </div>

              <div className="absolute -bottom-6 left-4 right-4 rounded-xl border border-ink-200 bg-white p-4 shadow-lift sm:left-6 sm:right-auto sm:w-64">
                <p className="text-3xl font-extrabold text-brand-800">98.4%</p>
                <p className="mt-1 text-sm text-ink-600">
                  of business consignments delivered within the quoted window last quarter.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
