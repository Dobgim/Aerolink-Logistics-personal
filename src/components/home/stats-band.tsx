import { Container } from "@/components/ui/primitives";
import { RevealGroup, RevealItem } from "@/components/ui/motion";

const STATS = [
  { value: "24/7", label: "Network operations", sub: "Every hub, every day" },
  { value: "70+", label: "Cities served", sub: "Plus onward town delivery" },
  { value: "2–4", label: "Days express transit", sub: "Between major gateways" },
  { value: "98.4%", label: "On-time delivery", sub: "Rolling 90-day average" },
];

export function StatsBand() {
  return (
    <div className="border-b border-ink-200 bg-white">
      <Container className="py-10 sm:py-12">
        <RevealGroup className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
          {STATS.map((stat) => (
            <RevealItem key={stat.label}>
              <p className="font-display text-3xl font-extrabold tracking-[-0.03em] text-brand-800 sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1.5 text-sm font-bold text-ink-900">{stat.label}</p>
              <p className="mt-0.5 text-xs text-ink-500">{stat.sub}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </div>
  );
}
