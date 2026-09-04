import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, PackageSearch } from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { TrackForm } from "@/components/tracking/track-form";
import { TrackingResultSkeleton } from "@/components/tracking/result-skeleton";
import { ShipmentView } from "@/components/tracking/shipment-view";
import { ShipmentNotFound } from "@/components/tracking/not-found-state";
import { StatusHeader } from "@/components/tracking/status-header";
import { getShipmentByTracking } from "@/lib/data/repository";
import { SAMPLE_TRACKING_NUMBER } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: "Track Your Shipment",
  description:
    "Track a FreightCargoXpress shipment in real time — status, current location, full scan history, live map and estimated delivery date.",
  alternates: { canonical: "/tracking" },
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ number?: string }>;
}

export default async function TrackingPage({ searchParams }: PageProps) {
  const { number = "" } = await searchParams;
  const numbers = number
    .split(",")
    .map((n) => n.trim())
    .filter(Boolean)
    .slice(0, 10);

  return (
    <>
      <section className="border-b border-ink-200 bg-linear-to-b from-ink-950 to-brand-950 py-12 sm:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-brand-100">
                <PackageSearch aria-hidden className="size-3.5" />
                Shipment tracking
              </p>
              <h1 className="mt-5 text-3xl font-extrabold leading-[1.08] text-white sm:text-4xl lg:text-5xl">
                Track Your Shipment
              </h1>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-300 sm:text-lg">
                Every handover is scanned. Enter your tracking number to see where your consignment
                is right now, what happens next, and when it arrives.
              </p>
            </div>

            <TrackForm defaultValue={number} autoFocus={numbers.length === 0} />
          </div>
        </Container>
      </section>

      <section className="bg-ink-50 py-10 sm:py-14">
        <Container>
          {numbers.length === 0 ? (
            <EmptyState />
          ) : (
            <Suspense key={number} fallback={<TrackingResultSkeleton />}>
              <Results numbers={numbers} />
            </Suspense>
          )}
        </Container>
      </section>
    </>
  );
}

async function Results({ numbers }: { numbers: string[] }) {
  const results = await Promise.all(
    numbers.map(async (n) => ({ query: n, shipment: await getShipmentByTracking(n) })),
  );

  if (results.length === 1) {
    const [only] = results;
    return only.shipment ? (
      <ShipmentView shipment={only.shipment} />
    ) : (
      <ShipmentNotFound trackingNumber={only.query} />
    );
  }

  const found = results.filter((r) => r.shipment);
  const missing = results.filter((r) => !r.shipment);

  return (
    <div className="space-y-6">
      <p className="text-sm font-semibold text-ink-600">
        Showing {found.length} of {results.length} shipments. Select one to open its full tracking
        history.
      </p>

      <div className="space-y-4">
        {found.map(({ shipment }) =>
          shipment ? (
            <div key={shipment.id} className="space-y-3">
              <StatusHeader shipment={shipment} />
              <Link
                href={`/tracking?number=${encodeURIComponent(shipment.tracking_number)}`}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-900"
              >
                Open full tracking history
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            </div>
          ) : null,
        )}
      </div>

      {missing.length > 0 ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="text-sm font-bold text-amber-900">
            {missing.length} tracking {missing.length === 1 ? "number" : "numbers"} not found
          </h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {missing.map((m) => (
              <li
                key={m.query}
                className="rounded-md bg-white px-2.5 py-1 font-mono text-xs text-amber-900 ring-1 ring-inset ring-amber-200"
              >
                {m.query}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function EmptyState() {
  const steps = [
    {
      title: "Find your number",
      body: "It is printed on your shipping label and included in the confirmation email we send when the shipment is created.",
    },
    {
      title: "Follow every scan",
      body: "Pickup, departure, hub arrival, customs, out for delivery — each one is timestamped with its location.",
    },
    {
      title: "Plan the delivery",
      body: "We publish an estimated delivery date and update it the moment anything on the route changes.",
    },
  ];

  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card sm:p-10">
      <h2 className="text-xl font-extrabold text-ink-900 sm:text-2xl">
        Enter a tracking number to get started
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-600 sm:text-base">
        Tracking is open to everyone — no account needed. Try the sample shipment{" "}
        <Link
          href={`/tracking?number=${encodeURIComponent(SAMPLE_TRACKING_NUMBER)}`}
          className="font-mono font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-900"
        >
          {SAMPLE_TRACKING_NUMBER}
        </Link>{" "}
        to see a live record end to end.
      </p>

      <ol className="mt-8 grid gap-6 sm:grid-cols-3">
        {steps.map((step, i) => (
          <li key={step.title}>
            <span className="inline-flex size-8 items-center justify-center rounded-lg bg-brand-50 text-sm font-extrabold text-brand-700">
              {i + 1}
            </span>
            <h3 className="mt-3 text-base font-bold text-ink-900">{step.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{step.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
