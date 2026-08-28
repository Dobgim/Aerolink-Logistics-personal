import QRCode from "qrcode";
import type { PartyDetails, Shipment } from "@/types";
import { SITE } from "@/lib/constants/site";
import {
  PACKAGE_LABELS,
  PAYMENT_STATUS_LABELS,
  SERVICE_LABELS,
  formatDate,
  formatMoney,
  formatTime,
  formatWeight,
  invoiceTotal,
} from "@/lib/utils/format";
import { CARGO_LABELS } from "@/lib/utils/progress";

/** Pulls the sender or receiver out of the flat shipment row. */
export function partyFrom(shipment: Shipment, side: "sender" | "receiver"): PartyDetails {
  return {
    name: shipment[`${side}_name`],
    company: shipment[`${side}_company`],
    email: shipment[`${side}_email`],
    phone: shipment[`${side}_phone`],
    city: shipment[`${side}_city`],
    state: shipment[`${side}_state`],
    country: shipment[`${side}_country`],
  };
}

function PartyBlock({ label, party }: { label: string; party: PartyDetails }) {
  const locality = [party.city, party.state].filter(Boolean).join(", ");

  return (
    <div>
      <h2 className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ink-500">
        {label}
      </h2>
      <address className="mt-2.5 not-italic">
        <p className="text-base font-bold text-ink-900">{party.name}</p>
        {party.company ? (
          <p className="text-sm font-semibold text-ink-700">{party.company}</p>
        ) : null}

        <div className="mt-2 space-y-0.5 text-sm leading-relaxed text-ink-600">
          {locality ? <p>{locality}</p> : null}
          {party.country ? <p>{party.country}</p> : null}
        </div>

        <div className="mt-2 space-y-0.5 text-sm text-ink-600">
          {party.phone ? (
            <p>
              <span className="text-ink-500">T</span> {party.phone}
            </p>
          ) : null}
          {party.email ? (
            <p className="break-all">
              <span className="text-ink-500">E</span> {party.email}
            </p>
          ) : null}
        </div>
      </address>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-ink-200 py-2 last:border-0">
      <dt className="text-sm text-ink-600">{label}</dt>
      <dd className="text-right text-sm font-semibold text-ink-900">{value}</dd>
    </div>
  );
}

/**
 * A commercial invoice / waybill for one shipment. Rendered on the server so
 * the full record is available, and styled to print cleanly on A4 or Letter.
 */
export async function InvoiceDocument({ shipment }: { shipment: Shipment }) {
  const sender = partyFrom(shipment, "sender");
  const receiver = partyFrom(shipment, "receiver");
  const total = invoiceTotal(shipment);
  const paid = shipment.payment_status === "paid";

  /*
   * Scanning the code opens this shipment's tracking page. Rendered to an
   * inline SVG on the server so the invoice prints without a network fetch.
   */
  const trackingUrl = `${SITE.url}/tracking?number=${encodeURIComponent(shipment.tracking_number)}`;
  const qrSvg = await QRCode.toString(trackingUrl, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
    color: { dark: "#151a22", light: "#00000000" },
  });

  return (
    <article className="mx-auto w-full max-w-4xl bg-white p-6 text-ink-900 shadow-card print:max-w-none print:p-0 print:shadow-none sm:p-10">
      {/* Masthead */}
      <header className="flex flex-col gap-6 border-b-2 border-ink-900 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-display text-2xl font-extrabold tracking-[-0.02em]">
            Royal<span className="text-brand-700">Prime</span>
          </p>
          <p className="mt-0.5 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-ink-500">
            Logistics
          </p>
          <div className="mt-4 space-y-0.5 text-sm text-ink-600">
            <p>{SITE.address}</p>
            <p>{SITE.phone}</p>
            <p className="break-all">{SITE.email}</p>
          </div>
        </div>

        <div className="sm:text-right">
          <h1 className="text-3xl font-extrabold tracking-[-0.02em] sm:text-4xl">INVOICE</h1>
          <dl className="mt-4 space-y-1 text-sm">
            <div className="flex justify-between gap-6 sm:justify-end">
              <dt className="text-ink-500">Invoice no.</dt>
              <dd className="font-mono font-bold">{shipment.order_number}</dd>
            </div>
            <div className="flex justify-between gap-6 sm:justify-end">
              <dt className="text-ink-500">Tracking no.</dt>
              <dd className="font-mono font-bold">{shipment.tracking_number}</dd>
            </div>
            <div className="flex justify-between gap-6 sm:justify-end">
              <dt className="text-ink-500">Issued</dt>
              <dd className="font-semibold">{formatDate(shipment.created_at)}</dd>
            </div>
          </dl>

          <div className="mt-4 flex items-start gap-4 sm:justify-end">
            <p
              className={`inline-block rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-[0.1em] ring-1 ring-inset ${
                paid
                  ? "bg-emerald-50 text-emerald-800 ring-emerald-300"
                  : "bg-amber-50 text-amber-800 ring-amber-300"
              }`}
            >
              {PAYMENT_STATUS_LABELS[shipment.payment_status]}
            </p>

            <figure className="shrink-0 text-center">
              <div
                aria-hidden
                className="size-24 [&>svg]:size-full"
                dangerouslySetInnerHTML={{ __html: qrSvg }}
              />
              <figcaption className="mt-1 text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-ink-500">
                Scan to track
              </figcaption>
            </figure>
          </div>
        </div>
      </header>

      {/* Parties */}
      <section className="grid gap-8 border-b border-ink-200 py-6 sm:grid-cols-2">
        <PartyBlock label="Sender / Shipper" party={sender} />
        <PartyBlock label="Receiver / Consignee" party={receiver} />
      </section>

      {/* Shipment */}
      <section className="grid gap-8 border-b border-ink-200 py-6 sm:grid-cols-2">
        <div>
          <h2 className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ink-500">
            Shipment details
          </h2>
          <dl className="mt-2.5">
            <Row label="Service" value={SERVICE_LABELS[shipment.shipping_service]} />
            <Row label="Package type" value={PACKAGE_LABELS[shipment.package_type]} />
            <Row label="Pieces" value={shipment.packages} />
            <Row label="Total weight" value={formatWeight(shipment.weight)} />
            <Row label="Contents" value={CARGO_LABELS[shipment.cargo_type]} />
          </dl>
        </div>

        <div>
          <h2 className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ink-500">
            Routing
          </h2>
          <dl className="mt-2.5">
            <Row
              label="Origin"
              value={`${shipment.origin_city}, ${shipment.origin_country}`}
            />
            <Row
              label="Destination"
              value={`${shipment.destination_city}, ${shipment.destination_country}`}
            />
            <Row label="Ship date" value={formatDate(shipment.ship_date)} />
            <Row
              label="Expected delivery"
              value={`${formatDate(shipment.estimated_delivery)} · ${formatTime(shipment.estimated_delivery)}`}
            />
            <Row
              label="Declared value"
              value={formatMoney(shipment.declared_value, shipment.currency)}
            />
          </dl>
        </div>
      </section>

      {/* Goods */}
      {shipment.goods_description ? (
        <section className="border-b border-ink-200 py-6">
          <h2 className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ink-500">
            Description of goods
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-700">
            {shipment.goods_description}
          </p>
        </section>
      ) : null}

      {/* Charges */}
      <section className="py-6">
        <h2 className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-ink-500">
          Charges
        </h2>

        <div className="mt-3">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Invoice charges</caption>
            <thead>
              <tr className="border-b border-ink-300">
                <th scope="col" className="py-2 text-xs font-bold uppercase tracking-[0.08em] text-ink-500">
                  Item
                </th>
                <th
                  scope="col"
                  className="py-2 text-right text-xs font-bold uppercase tracking-[0.08em] text-ink-500"
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-ink-200">
                <td className="py-2.5 text-sm text-ink-700">
                  Amount to pay
                  {/* The admin's own words on what this covers, when they gave any. */}
                  {shipment.payment_description ? (
                    <span className="mt-1 block text-xs leading-relaxed text-ink-500">
                      {shipment.payment_description}
                    </span>
                  ) : null}
                </td>
                <td className="py-2.5 text-right align-top text-sm font-semibold tabular-nums">
                  {formatMoney(Number(shipment.amount_due ?? 0), shipment.currency)}
                </td>
              </tr>
              <tr>
                <td className="pt-3 text-base font-extrabold">Total due</td>
                <td className="pt-3 text-right text-base font-extrabold tabular-nums">
                  {formatMoney(total, shipment.currency)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <footer className="border-t border-ink-200 pt-5 text-xs leading-relaxed text-ink-500">
        <p>
          Carriage is subject to the Royal Prime Logistics terms of carriage. The amount shown
          above is the total payable on this shipment; no further charges are raised against the
          receiver once it is settled.
        </p>
        <p className="mt-2">
          Invoice {shipment.order_number} · Tracking {shipment.tracking_number} · Generated{" "}
          {formatDate(shipment.created_at)}
        </p>
      </footer>
    </article>
  );
}
