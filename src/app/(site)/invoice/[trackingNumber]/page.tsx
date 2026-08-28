import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { InvoiceDocument } from "@/components/invoice/invoice-document";
import { PrintButton } from "@/components/invoice/print-button";
import { getShipmentByTracking } from "@/lib/data/repository";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ trackingNumber: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { trackingNumber } = await params;
  const shipment = await getShipmentByTracking(decodeURIComponent(trackingNumber));

  return {
    title: shipment ? `Invoice ${shipment.order_number}` : "Invoice",
    // An invoice carries personal data; it should never be indexed.
    robots: { index: false, follow: false },
  };
}

export default async function InvoicePage({ params }: PageProps) {
  const { trackingNumber } = await params;
  const shipment = await getShipmentByTracking(decodeURIComponent(trackingNumber));
  if (!shipment) notFound();

  return (
    <div className="bg-ink-100 py-8 print:bg-white print:py-0">
      <Container className="print:max-w-none print:px-0">
        <div className="mx-auto mb-6 flex max-w-4xl flex-wrap items-center justify-between gap-4 print:hidden">
          <Link
            href={`/tracking?number=${encodeURIComponent(shipment.tracking_number)}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-700 transition-colors hover:text-brand-700"
          >
            <ChevronLeft aria-hidden className="size-4" />
            Back to tracking
          </Link>

          <PrintButton />
        </div>

        <InvoiceDocument shipment={shipment} />
      </Container>
    </div>
  );
}
