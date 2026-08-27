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
            src={IMAGES.lastMile}
            alt="A courier riding through the city on a last-mile delivery round"
            fill
            priority
            sizes="100vw"
            quality={72}
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover object-[65%_center]"
          />
        </motion.div>
        {/*
          Readability overlay — darkest where the copy sits.

          Every stop is an explicit alpha of the same ink colour: Tailwind v4
          interpolates gradients in oklab, so a `via-transparent` midpoint is
          mixed through black and quietly blacks the photo out.
        */}
        <div className="absolute inset-0 bg-linear-to-r from-ink-950/92 via-ink-950/70 to-ink-950/30" />
        <div className="absolute inset-0 bg-linear-to-t from-ink-950/85 via-ink-950/10 to-ink-950/35" />
        <div aria-hidden className="grid-fade absolute inset-0" />
      </div>

      <Container className="relative py-16 sm:py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <div className="max-w-2xl">
            <motion.h1
              {...rise(0.02)}
              className="text-[2.5rem] font-extrabold leading-[1.05] text-white sm:text-5xl lg:text-6xl xl:text-[4.25rem]"
            >
              Ship Anywhere.
              <br />
              <span className="text-brand-300">Track Everything.</span>
            </motion.h1>

            <motion.p
              {...rise(0.16)}
              className="mt-5 max-w-xl text-base leading-relaxed text-ink-200 sm:mt-6 sm:text-lg"
            >
              Reliable international shipping with real-time shipment tracking from pickup to
              delivery.
            </motion.p>

            <motion.div {...rise(0.24)} className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <ButtonLink href="/tracking" size="lg" variant="accent" className="w-full sm:w-auto">
                Track Your Shipment
              </ButtonLink>
              <ButtonLink href="/services" size="lg" variant="light" className="w-full sm:w-auto">
                Explore Services
              </ButtonLink>
            </motion.div>

            <motion.ul
              {...rise(0.32)}
              className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-white/15 pt-6"
            >
              {TRUST.map(({ Icon, label }) => (
                <li key={label} className="flex items-center gap-2 text-sm font-semibold text-ink-300">
                  <Icon aria-hidden className="size-4 text-brand-300" />
                  {label}
                </li>
              ))}
            </motion.ul>
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: EASE, delay: reduce ? 0 : 0.3 }}
            className="w-full"
          >
            <TrackForm autoFocus={false} />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
