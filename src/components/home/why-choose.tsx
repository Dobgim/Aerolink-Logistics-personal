import {
  Bell,
  Globe2,
  Headphones,
  Radar,
  ShieldCheck,
  Timer,
  type LucideIcon,
} from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { RevealGroup, RevealItem } from "@/components/ui/motion";
import { SITE } from "@/lib/constants/site";

const REASONS: { Icon: LucideIcon; title: string; body: string }[] = [
  {
    Icon: Radar,
    title: "Real-Time Tracking",
    body: "Every handling scan reaches your tracking page within seconds of it happening at the facility.",
  },
  {
    Icon: Globe2,
    title: "International Coverage",
    body: "A single connected network of gateways, linehauls and final-mile rounds across our service area.",
  },
  {
    Icon: ShieldCheck,
    title: "Secure Delivery",
    body: "Tamper-evident handling, insured transit and signature capture on final delivery.",
  },
  {
    Icon: Timer,
    title: "Fast Transit",
    body: "Express consignments clear in two to four days between gateways, with next-flight-out recovery.",
  },
  {
    Icon: Headphones,
    title: "Professional Support",
    body: `A real logistics team on the phone ${SITE.hours.toLowerCase()}, not a scripted chatbot.`,
  },
  {
    Icon: Bell,
    title: "Transparent Updates",
    body: "Proactive notices when customs, weather or a missed connection changes your delivery date.",
  },
];

export function WhyChoose() {
  return (
    <Section tone="muted">
      <Container>
        <SectionHeading
          eyebrow="Why AeroLink"
          title="Why Choose AeroLink?"
          description="International freight is unforgiving. These are the things we refuse to get wrong."
          align="center"
        />

        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map(({ Icon, title, body }) => (
            <RevealItem key={title}>
              <div className="group h-full rounded-2xl border border-ink-200/80 bg-white p-6 shadow-card transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift motion-reduce:hover:translate-y-0">
                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-colors duration-300 group-hover:bg-brand-700 group-hover:text-white">
                  <Icon aria-hidden className="size-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-ink-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
