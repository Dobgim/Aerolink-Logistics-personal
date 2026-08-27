"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PackageX } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { EASE } from "@/components/ui/motion";
import { SAMPLE_TRACKING_NUMBER } from "@/lib/constants/site";

export function ShipmentNotFound({ trackingNumber }: { trackingNumber?: string }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
      role="status"
      className="rounded-2xl border border-ink-200 bg-white p-8 text-center shadow-card sm:p-12"
    >
      <motion.span
        initial={reduce ? false : { scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: EASE, delay: reduce ? 0 : 0.1 }}
        className="mx-auto inline-flex size-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600"
      >
        <PackageX aria-hidden className="size-8" />
      </motion.span>

      <h2 className="mt-6 text-2xl font-extrabold text-ink-900 sm:text-3xl">Shipment Not Found</h2>
      <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-ink-600">
        We couldn&apos;t find a shipment with that tracking number. Please check the number and try
        again.
      </p>

      {trackingNumber ? (
        <p className="mt-4 inline-block rounded-lg bg-ink-100 px-3 py-1.5 font-mono text-sm text-ink-700">
          {trackingNumber}
        </p>
      ) : null}

      <ul className="mx-auto mt-6 max-w-md space-y-1.5 text-left text-sm text-ink-600">
        <li>· Tracking numbers look like {SAMPLE_TRACKING_NUMBER}.</li>
        <li>· Newly created shipments can take up to 30 minutes to appear.</li>
        <li>· Check for a typo, or copy the number straight from your confirmation email.</li>
      </ul>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <ButtonLink href="/contact" size="md">
          Contact Support
        </ButtonLink>
        <ButtonLink href="/tracking" size="md" variant="outline">
          Try another number
        </ButtonLink>
      </div>
    </motion.div>
  );
}
