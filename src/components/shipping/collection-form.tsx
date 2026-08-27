"use client";

import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/field";
import { Card } from "@/components/ui/primitives";
import { useToast } from "@/components/ui/toast";
import { EASE } from "@/components/ui/motion";
import { SERVICES } from "@/lib/constants/services";
import { ALL_MARKETS } from "@/lib/constants/geo";
import { PACKAGE_LABELS } from "@/lib/utils/format";
import type { PackageType } from "@/types";

const PACKAGE_TYPES = Object.keys(PACKAGE_LABELS) as PackageType[];

/**
 * Booking a collection creates a real support request through /api/support,
 * which lands in the admin dashboard for the operations team to price and
 * convert into a shipment.
 */
export function CollectionForm({ defaultService }: { defaultService?: string }) {
  const toast = useToast();
  const reduce = useReducedMotion();
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const raw = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    const message = [
      `Service requested: ${raw.service}`,
      `Collection: ${raw.origin_city}, ${raw.origin_country}`,
      `Delivery: ${raw.destination_city}, ${raw.destination_country}`,
      `Contents: ${raw.package_type}`,
      `Weight: ${raw.weight} kg across ${raw.packages} package(s)`,
      `Ready from: ${raw.ready_date || "not specified"}`,
      "",
      raw.notes || "No additional notes.",
    ].join("\n");

    setSubmitting(true);
    setErrors({});

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: raw.name,
          email: raw.email,
          phone: raw.phone,
          subject: `Collection request — ${raw.origin_city} to ${raw.destination_city}`,
          message,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        setErrors((payload.details as Record<string, string>) ?? {});
        toast.error(
          payload.error ?? "We could not submit your request",
          "Please check the highlighted fields.",
        );
        return;
      }

      form.reset();
      setReference(payload.request?.id ?? null);
      toast.success("Collection request sent", "Our team will confirm pricing and a pickup slot.");
    } catch {
      toast.error("Network error", "Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (reference) {
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <Card className="py-12 text-center">
          <span className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 aria-hidden className="size-7" />
          </span>
          <h2 className="mt-5 text-xl font-extrabold text-ink-900">Collection request received</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-600">
            Our team will confirm the rate and a pickup window by email. Once the shipment is
            booked you will get a tracking number you can follow from this site.
          </p>
          <p className="mt-4 inline-block rounded-lg bg-ink-100 px-3 py-1.5 font-mono text-xs text-ink-700">
            Reference {reference}
          </p>
          <div className="mt-6">
            <Button variant="outline" size="md" onClick={() => setReference(null)}>
              Book another collection
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <Card>
      <form onSubmit={onSubmit} noValidate className="grid gap-5">
        <fieldset className="grid gap-5">
          <legend className="text-sm font-bold uppercase tracking-[0.1em] text-ink-500">
            Your details
          </legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <Input name="name" label="Full name" required autoComplete="name" error={errors.name} />
            <Input
              name="email"
              type="email"
              label="Email address"
              required
              autoComplete="email"
              error={errors.email}
            />
          </div>
          <Input name="phone" type="tel" label="Phone number" autoComplete="tel" error={errors.phone} />
        </fieldset>

        <fieldset className="grid gap-5 border-t border-ink-200 pt-5">
          <legend className="text-sm font-bold uppercase tracking-[0.1em] text-ink-500">
            Route
          </legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <Select name="origin_country" label="Collection country" required defaultValue="United States">
              {ALL_MARKETS.map((m) => (
                <option key={m.code} value={m.country}>
                  {m.country}
                </option>
              ))}
            </Select>
            <Input name="origin_city" label="Collection city" required placeholder="New York" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Select name="destination_country" label="Delivery country" required defaultValue="France">
              {ALL_MARKETS.map((m) => (
                <option key={m.code} value={m.country}>
                  {m.country}
                </option>
              ))}
            </Select>
            <Input name="destination_city" label="Delivery city" required placeholder="Paris" />
          </div>
        </fieldset>

        <fieldset className="grid gap-5 border-t border-ink-200 pt-5">
          <legend className="text-sm font-bold uppercase tracking-[0.1em] text-ink-500">
            Shipment
          </legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <Select
              name="service"
              label="Service"
              required
              defaultValue={
                SERVICES.find((s) => s.slug === defaultService)?.name ?? SERVICES[0].name
              }
            >
              {SERVICES.map((s) => (
                <option key={s.slug} value={s.name}>
                  {s.name}
                </option>
              ))}
            </Select>
            <Select name="package_type" label="Contents" required defaultValue="Parcel">
              {PACKAGE_TYPES.map((type) => (
                <option key={type} value={PACKAGE_LABELS[type]}>
                  {PACKAGE_LABELS[type]}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <Input
              name="weight"
              type="number"
              min="0.1"
              step="0.1"
              label="Total weight (kg)"
              required
              defaultValue="5"
            />
            <Input
              name="packages"
              type="number"
              min="1"
              step="1"
              label="Packages"
              required
              defaultValue="1"
            />
            <Input name="ready_date" type="date" label="Ready for collection" />
          </div>

          <Textarea
            name="notes"
            label="Anything we should know?"
            rows={4}
            placeholder="Fragile contents, restricted access, preferred pickup window…"
          />
        </fieldset>

        <div className="flex flex-col gap-3 border-t border-ink-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-500">
            This sends a collection request — nothing is charged until you confirm the rate.
          </p>
          <Button
            type="submit"
            size="lg"
            loading={submitting}
            icon={<Send aria-hidden className="size-4" />}
            className="w-full sm:w-auto"
          >
            {submitting ? "Sending" : "Request collection"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
