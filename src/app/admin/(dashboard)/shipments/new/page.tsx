import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ShipmentForm } from "@/components/admin/shipment-form";

export const metadata = { title: "Create shipment" };

export default function NewShipmentPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/shipments"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-600 hover:text-brand-700"
        >
          <ChevronLeft aria-hidden className="size-4" />
          Back to shipments
        </Link>
        <h1 className="mt-3 text-2xl font-extrabold text-ink-900 sm:text-3xl">Create shipment</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-ink-600">
          Creating a shipment issues a tracking number and posts the first scan, so the customer
          timeline is live immediately.
        </p>
      </div>

      <ShipmentForm />
    </div>
  );
}
