"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Globe2, PlaneTakeoff, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/primitives";
import { EASE } from "@/components/ui/motion";
import { TrackForm } from "@/components/tracking/track-form";
import { BLUR_DATA_URL, IMAGES } from "@/lib/constants/images";

const TRUST = [
  { Icon: Globe2, label: "Worldwide coverage" },
  { Icon: PlaneTakeoff, label: "Daily air departures" },
  { Icon: ShieldCheck, label: "Insured end-to-end" },
];

export function Hero() {
  const reduce = useReducedMotion();

  const rise = (delay: number) =>
    reduce
      ? { initial: false as const, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y: 26 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, ease: EASE, delay },
        };

  return (
    <section className="relative isolate overflow-hidden bg-ink-950">
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute inset-0"
          initial={reduce ? false : { scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: EASE }}
        >
          <Image
            src={IMAGES.heroPort}
            alt="Container ships being worked by gantry cranes at an international freight terminal"
            fill
            priority
            sizes="100vw"
            quality={72}
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover object-[50%_center]"
          />
        </motion.div>
        {/*
          The copy is centred over the image, so the scrim is centre-weighted
          rather than side-weighted. Every stop is an explicit alpha of the same
          ink colour: Tailwind v4 interpolates gradients in oklab, so a
          `via-transparent` midpoint mixes through black and blacks the photo out.
        */}
        <div className="absolute inset-0 bg-ink-950/35" />
        <div className="absolute inset-0 bg-linear-to-b from-ink-950/60 via-ink-950/25 to-ink-950/80" />
        <div aria-hidden className="grid-fade absolute inset-0" />
      </div>

      <Container className="relative py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h1
            {...rise(0.02)}
            className="text-[2.5rem] font-extrabold leading-[1.05] text-white sm:text-5xl lg:text-6xl xl:text-[4.25rem]"
          >
            Ship Anywhere.
            <br />
            <span className="text-brand-300">Track Everything.</span>
          </motion.h1>

          <motion.p
            {...rise(0.12)}
            className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-200 sm:mt-6 sm:text-lg"
          >
            Reliable international shipping with real-time shipment tracking from pickup to
            delivery.
          </motion.p>
        </div>

        {/* The tracking card sits directly under the headline, centred. */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 32, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, ease: EASE, delay: reduce ? 0 : 0.22 }}
          className="mx-auto mt-9 w-full max-w-3xl sm:mt-10"
        >
          <TrackForm autoFocus={false} />
        </motion.div>

        <motion.div
          {...rise(0.34)}
          className="mx-auto mt-8 flex max-w-3xl flex-col items-center gap-6"
        >
          <ButtonLink href="/services" size="lg" variant="light" className="w-full sm:w-auto">
            Explore Services
          </ButtonLink>

          <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 border-t border-white/15 pt-6">
            {TRUST.map(({ Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 text-sm font-semibold text-ink-300"
              >
                <Icon aria-hidden className="size-4 text-brand-300" />
                {label}
              </li>
            ))}
          </ul>
        </motion.div>
      </Container>
    </section>
  );
}
