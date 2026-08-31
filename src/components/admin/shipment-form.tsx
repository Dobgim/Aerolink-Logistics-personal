"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AlertCircle, RefreshCw, Save } from "lucide-react";
import type { Shipment } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/primitives";
import { Input, Select } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { SERVICES } from "@/lib/constants/services";
import { citiesForCountry } from "@/lib/constants/geo";
import { WORLD_COUNTRIES } from "@/lib/constants/countries";
import {
  PACKAGE_LABELS,
  PAYMENT_STATUS_LABELS,
  STATUS_LABELS,
  generateOrderNumber,
  generateTrackingNumber,
  toInputDate,
  toInputTime,
} from "@/lib/utils/format";
import type { CargoType, PackageType, PaymentStatus, ShipmentStatus } from "@/types";
import { CARGO_LABELS } from "@/lib/utils/progress";

const PACKAGE_TYPES = Object.keys(PACKAGE_LABELS) as PackageType[];
const STATUSES = Object.keys(STATUS_LABELS) as ShipmentStatus[];
const PAYMENT_STATUSES = Object.keys(PAYMENT_STATUS_LABELS) as PaymentStatus[];
const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "CHF"];
const CARGO_TYPES = Object.keys(CARGO_LABELS) as CargoType[];

/** Uploaded artwork is inlined as a data URI so there is no storage bucket to run. */
const MAX_CARGO_IMAGE_BYTES = 600_000;

interface Props {
  shipment?: Shipment;
}

function Fieldset({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-ink-200 pt-5 first:border-0 first:pt-0">
      <legend className="mb-4 text-sm font-bold uppercase tracking-[0.1em] text-ink-500">
        {legend}
      </legend>
      <div className="grid gap-5">{children}</div>
    </fieldset>
  );
}

export function ShipmentForm({ shipment }: Props) {
  const router = useRouter();
  const toast = useToast();
  const editing = Boolean(shipment);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [trackingNumber, setTrackingNumber] = useState(shipment?.tracking_number ?? "");
  const [orderNumber, setOrderNumber] = useState(shipment?.order_number ?? "");
  const [cargoImage, setCargoImage] = useState(shipment?.cargo_image_url ?? "");
  const [cargoError, setCargoError] = useState<string | null>(null);

  function onCargoFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setCargoError("Choose an image file.");
      return;
    }
    if (file.size > MAX_CARGO_IMAGE_BYTES) {
      setCargoError(
        `That image is ${(file.size / 1024 / 1024).toFixed(1)} MB. Use one under 600 KB.`,
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setCargoError(null);
      setCargoImage(String(reader.result ?? ""));
    };
    reader.onerror = () => setCargoError("That file could not be read.");
    reader.readAsDataURL(file);
  }
  const [originCountry, setOriginCountry] = useState(shipment?.origin_country ?? "United States");
  const [destinationCountry, setDestinationCountry] = useState(
    shipment?.destination_country ?? "France",
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const raw = Object.fromEntries(new FormData(event.currentTarget).entries());

    setSubmitting(true);
    setFormError(null);
    setErrors({});

    try {
      const response = await fetch(
        editing ? `/api/shipments/${shipment!.id}` : "/api/shipments",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(raw),
        },
      );
      const payload = await response.json();

      if (!response.ok) {
        setErrors((payload.details as Record<string, string>) ?? {});
        setFormError(payload.error ?? "We could not save this shipment");
        return;
      }

      toast.success(
        editing ? "Shipment updated" : "Shipment created",
        payload.shipment?.tracking_number,
      );
      router.push(`/admin/shipments/${payload.shipment.id}`);
      router.refresh();
    } catch {
      setFormError("Network error — check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {formError ? (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
        >
          <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
          {formError}
        </p>
      ) : null}

      <Card>
        <div className="grid gap-6">
          <Fieldset legend="Identification">
            <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <Input
                name="tracking_number"
                label="Tracking number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Leave blank to generate automatically"
                hint={editing ? undefined : "Blank generates one in the RPL-YYYY-NNNNNN format."}
                error={errors.tracking_number}
                className="font-mono"
              />
              <Button
                variant="outline"
                size="md"
                onClick={() => setTrackingNumber(generateTrackingNumber())}
                icon={<RefreshCw aria-hidden className="size-4" />}
              >
                Generate
              </Button>
            </div>

            <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <Input
                name="order_number"
                label="Order number"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Leave blank to generate automatically"
                hint={
                  editing
                    ? "The commercial reference printed on the invoice."
                    : "Blank generates one in the ORD-YYYY-NNNNNNN format. Separate from the tracking number."
                }
                error={errors.order_number}
                className="font-mono"
              />
              <Button
                variant="outline"
                size="md"
                onClick={() => setOrderNumber(generateOrderNumber())}
                icon={<RefreshCw aria-hidden className="size-4" />}
              >
                Generate
              </Button>
            </div>
          </Fieldset>

          <Fieldset legend="Sender">
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                name="sender_name"
                label="Sender name"
                required
                defaultValue={shipment?.sender_name}
                error={errors.sender_name}
              />
              <Input
                name="sender_company"
                label="Company"
                hint="Optional"
                defaultValue={shipment?.sender_company ?? ""}
                error={errors.sender_company}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                name="sender_email"
                type="email"
                label="Email"
                defaultValue={shipment?.sender_email ?? ""}
                error={errors.sender_email}
              />
              <Input
                name="sender_phone"
                type="tel"
                label="Phone"
                defaultValue={shipment?.sender_phone ?? ""}
                error={errors.sender_phone}
              />
            </div>


            <div className="grid gap-5 sm:grid-cols-3">
              <Input
                name="sender_city"
                label="City"
                defaultValue={shipment?.sender_city ?? ""}
                error={errors.sender_city}
              />
              <Input
                name="sender_state"
                label="State / region"
                defaultValue={shipment?.sender_state ?? ""}
                error={errors.sender_state}
              />
              <Input
                name="sender_country"
                label="Country"
                defaultValue={shipment?.sender_country ?? ""}
                error={errors.sender_country}
              />
            </div>
          </Fieldset>

          <Fieldset legend="Receiver">
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                name="receiver_name"
                label="Receiver name"
                required
                defaultValue={shipment?.receiver_name}
                error={errors.receiver_name}
              />
              <Input
                name="receiver_company"
                label="Company"
                hint="Optional"
                defaultValue={shipment?.receiver_company ?? ""}
                error={errors.receiver_company}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                name="receiver_email"
                type="email"
                label="Email"
                defaultValue={shipment?.receiver_email ?? ""}
                error={errors.receiver_email}
              />
              <Input
                name="receiver_phone"
                type="tel"
                label="Phone"
                defaultValue={shipment?.receiver_phone ?? ""}
                error={errors.receiver_phone}
              />
            </div>


            <div className="grid gap-5 sm:grid-cols-3">
              <Input
                name="receiver_city"
                label="City"
                defaultValue={shipment?.receiver_city ?? ""}
                error={errors.receiver_city}
              />
              <Input
                name="receiver_state"
                label="State / region"
                defaultValue={shipment?.receiver_state ?? ""}
                error={errors.receiver_state}
              />
              <Input
                name="receiver_country"
                label="Country"
                defaultValue={shipment?.receiver_country ?? ""}
                error={errors.receiver_country}
              />
            </div>
          </Fieldset>

          <Fieldset legend="Route">
            <div className="grid gap-5 sm:grid-cols-2">
              <Select
                name="origin_country"
                label="Origin country"
                required
                value={originCountry}
                onChange={(e) => setOriginCountry(e.target.value)}
                error={errors.origin_country}
              >
                {WORLD_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.country}>
                    {c.country}
                  </option>
                ))}
              </Select>
              <Input
                name="origin_city"
                label="Origin city"
                required
                list="origin-cities"
                defaultValue={shipment?.origin_city ?? "New York"}
                error={errors.origin_city}
              />
              <datalist id="origin-cities">
                {citiesForCountry(originCountry).map((c) => (
                  <option key={c.city} value={c.city} />
                ))}
              </datalist>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Select
                name="destination_country"
                label="Destination country"
                required
                value={destinationCountry}
                onChange={(e) => setDestinationCountry(e.target.value)}
                error={errors.destination_country}
              >
                {WORLD_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.country}>
                    {c.country}
                  </option>
                ))}
              </Select>
              <Input
                name="destination_city"
                label="Destination city"
                required
                list="destination-cities"
                defaultValue={shipment?.destination_city ?? "Paris"}
                error={errors.destination_city}
              />
              <datalist id="destination-cities">
                {citiesForCountry(destinationCountry).map((c) => (
                  <option key={c.city} value={c.city} />
                ))}
              </datalist>
            </div>
          </Fieldset>

          <Fieldset legend="Consignment">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <Select
                name="package_type"
                label="Package type"
                required
                defaultValue={shipment?.package_type ?? "parcel"}
                error={errors.package_type}
              >
                {PACKAGE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {PACKAGE_LABELS[type]}
                  </option>
                ))}
              </Select>
              <Select
                name="shipping_service"
                label="Shipping service"
                required
                defaultValue={shipment?.shipping_service ?? "express_international"}
                error={errors.shipping_service}
              >
                {SERVICES.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.name}
                  </option>
                ))}
              </Select>
              <Input
                name="weight"
                type="number"
                min="0.01"
                step="0.01"
                label="Weight (kg)"
                required
                defaultValue={shipment?.weight ?? 5}
                error={errors.weight}
              />
              <Input
                name="packages"
                type="number"
                min="1"
                step="1"
                label="Packages"
                required
                defaultValue={shipment?.packages ?? 1}
                error={errors.packages}
              />
            </div>
          </Fieldset>

          <Fieldset legend="Goods and charges">
            <Input
              name="goods_description"
              label="Description of goods"
              placeholder="What is inside the shipment — printed on the invoice"
              defaultValue={shipment?.goods_description ?? ""}
              error={errors.goods_description}
            />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Select
                name="currency"
                label="Currency"
                defaultValue={shipment?.currency ?? "USD"}
                error={errors.currency}
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
              <Input
                name="declared_value"
                type="number"
                min="0"
                step="0.01"
                label="Declared value"
                hint="Customs value of the goods"
                defaultValue={shipment?.declared_value ?? 0}
                error={errors.declared_value}
              />
              <Input
                name="amount_due"
                type="number"
                min="0"
                step="0.01"
                label="Amount to pay"
                hint="What the receiver owes"
                defaultValue={shipment?.amount_due ?? 0}
                error={errors.amount_due}
              />
              <Select
                name="payment_status"
                label="Payment status"
                defaultValue={shipment?.payment_status ?? "unpaid"}
                error={errors.payment_status}
              >
                {PAYMENT_STATUSES.map((p) => (
                  <option key={p} value={p}>
                    {PAYMENT_STATUS_LABELS[p]}
                  </option>
                ))}
              </Select>
            </div>

            <Input
              name="payment_description"
              label="Amount to pay — description"
              placeholder="e.g. Balance due on delivery, payable to the courier in cash"
              hint="Printed on the invoice under the amount, so the receiver knows what it covers"
              defaultValue={shipment?.payment_description ?? ""}
              error={errors.payment_description}
            />
            <p className="text-xs text-ink-500">
              The amount below is what the receiver sees as the invoice total.
            </p>
          </Fieldset>

          <Fieldset legend="What is moving on the map">
            <p className="-mt-1 text-sm text-ink-600">
              Upload a photo of the actual goods and that image travels along the route on the
              customer&apos;s map. With no photo, the vehicle below is used instead.
            </p>

            <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
              <div className="grid gap-2">
                <label
                  htmlFor="cargo-image-file"
                  className="text-sm font-semibold text-ink-700"
                >
                  Photo of the goods
                </label>
                <input
                  id="cargo-image-file"
                  type="file"
                  accept="image/*"
                  onChange={onCargoFile}
                  className="block w-full rounded-xl border border-ink-300 p-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-brand-800 hover:file:bg-brand-100"
                />
                <p className="text-xs text-ink-500">
                  PNG or JPG under 600 KB — a photo of the exact car, machine or parcel.
                </p>
                {cargoError ? (
                  <p role="alert" className="text-sm font-medium text-red-600">
                    {cargoError}
                  </p>
                ) : null}
              </div>

              <div className="flex items-end gap-3">
                <div className="flex size-24 items-center justify-center overflow-hidden rounded-xl border border-ink-200 bg-ink-50">
                  {cargoImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cargoImage}
                      alt="Preview of the goods"
                      className="size-full object-contain"
                    />
                  ) : (
                    <span className="px-2 text-center text-xs text-ink-500">No photo</span>
                  )}
                </div>
                {cargoImage ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCargoImage("");
                      setCargoError(null);
                    }}
                  >
                    Remove
                  </Button>
                ) : null}
              </div>
            </div>

            <input type="hidden" name="cargo_image_url" value={cargoImage} />

            <Select
              name="cargo_type"
              label="Vehicle shown when there is no photo"
              defaultValue={shipment?.cargo_type ?? "package"}
              error={errors.cargo_type}
            >
              {CARGO_TYPES.map((c) => (
                <option key={c} value={c}>
                  {CARGO_LABELS[c]}
                </option>
              ))}
            </Select>
          </Fieldset>

          <Fieldset legend="Status and delivery">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <Select
                name="status"
                label="Current status"
                required
                defaultValue={shipment?.status ?? "pending"}
                error={errors.status}
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </Select>
              <Input
                name="ship_date"
                type="date"
                label="Ship date"
                hint="When it leaves the origin"
                defaultValue={toInputDate(shipment?.ship_date) || undefined}
                error={errors.ship_date}
              />
              <Input
                name="estimated_delivery"
                type="date"
                label="Expected delivery date"
                required
                defaultValue={toInputDate(shipment?.estimated_delivery) || undefined}
                error={errors.estimated_delivery}
              />
              <Input
                name="expected_delivery_time"
                type="time"
                label="Expected delivery time"
                hint="24-hour, UTC. Defaults to 17:00."
                defaultValue={toInputTime(shipment?.estimated_delivery)}
                error={errors.expected_delivery_time}
              />
            </div>
            <p className="text-xs text-ink-500">
              The shipment starts at its origin and moves as you post tracking scans — each scan
              carries its own location and coordinates.
            </p>
          </Fieldset>
        </div>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          size="lg"
          onClick={() => router.back()}
          className="sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="lg"
          loading={submitting}
          icon={<Save aria-hidden className="size-4" />}
        >
          {submitting ? "Saving" : editing ? "Save changes" : "Create shipment"}
        </Button>
      </div>
    </form>
  );
}
