import { Mail, MapPin, MessagesSquare, PhoneCall } from "lucide-react";
import { Container, Section } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/motion";
import { SITE } from "@/lib/constants/site";

export function SupportSection() {
  return (
    <Section tone="muted">
      <Container>
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card">
            <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-12 lg:p-12">
              <div>
                <h2 className="text-2xl font-extrabold leading-tight sm:text-3xl lg:text-[2.25rem]">
                  Need Help With Your Shipment?
                </h2>
                <p className="mt-3 max-w-md text-base leading-relaxed text-ink-600">
                  Our logistics team handles customs questions, delivery changes and claims
                  directly — no ticket queue, no scripts.
                </p>
                <p className="mt-4 text-sm font-semibold text-ink-500">{SITE.hours}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <ButtonLink
                  href="/contact"
                  size="lg"
                  className="w-full"
                  icon={<MessagesSquare aria-hidden className="size-4" />}
                >
                  Contact Support
                </ButtonLink>
                <ButtonLink
                  href={`tel:${SITE.phoneHref}`}
                  size="lg"
                  variant="outline"
                  className="w-full"
                  icon={<PhoneCall aria-hidden className="size-4" />}
                >
                  Call Us
                </ButtonLink>
                <ButtonLink
                  href={`mailto:${SITE.email}`}
                  size="lg"
                  variant="outline"
                  className="w-full"
                  icon={<Mail aria-hidden className="size-4" />}
                >
                  Email Us
                </ButtonLink>
                <ButtonLink
                  href="/locations"
                  size="lg"
                  variant="outline"
                  className="w-full"
                  icon={<MapPin aria-hidden className="size-4" />}
                >
                  Find a Location
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
