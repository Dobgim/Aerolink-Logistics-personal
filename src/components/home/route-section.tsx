"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PackageSearch } from "lucide-react";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/button";
import { EASE } from "@/components/ui/motion";

/**
 * The journey is drawn as stages rather than as a named corridor: the same
 * illustration then holds true for every lane we run, and nothing here goes
 * stale when the network changes.
 */
const STAGES = [
  { x: 62, y: 340, label: "Collected", note: "Scanned at your door", origin: true },
  { x: 176, y: 258, label: "Origin gateway", note: "Sorted and manifested" },
  { x: 292, y: 150, label: "In transit", note: "Airborne or on linehaul" },
  { x: 396, y: 214, label: "Customs cleared", note: "Import formalities done" },
  { x: 452, y: 112, label: "Delivered", note: "Signed for at the address" },
];

const PATH =
  "M62,340 C104,306 140,286 176,258 C214,222 250,184 292,150 C330,166 362,192 396,214 C424,186 432,146 452,112";

export function RouteSection() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-ink-950 py-16 text-ink-200 sm:py-20 lg:py-24">
      <div aria-hidden className="grid-fade absolute inset-0 opacity-70" />
      <div
        aria-hidden
        className="absolute -right-40 -top-40 size-[32rem] rounded-full bg-brand-700/25 blur-3xl"
      />

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <div>
            <Eyebrow tone="light">How a shipment moves</Eyebrow>
            <h2 className="mt-3 text-3xl font-extrabold leading-[1.1] text-white sm:text-4xl lg:text-[2.75rem]">
              Every hand-off, on the record
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-300 sm:text-lg">
              A shipment passes through several sets of hands between collection and delivery.
              Each one scans it, and each scan lands on your tracking page within seconds — so the
              status you see is the status on the warehouse floor.
            </p>

            <ol className="mt-8 space-y-3">
              {STAGES.map((stage, i) => (
                <motion.li
                  key={stage.label}
                  initial={reduce ? false : { opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.45, ease: EASE, delay: reduce ? 0 : i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <span
                    aria-hidden
                    className={`inline-flex size-7 shrink-0 items-center justify-center rounded-full text-[0.6875rem] font-bold ${
                      i === 0 ? "bg-accent-500 text-white" : "bg-white/10 text-brand-200"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm font-semibold text-white">{stage.label}</span>
                  <span className="text-sm text-ink-400">{stage.note}</span>
                </motion.li>
              ))}
            </ol>

            <ButtonLink
              href="/tracking"
              variant="light"
              size="md"
              className="mt-8"
              icon={<PackageSearch aria-hidden className="size-4" />}
            >
              Track a shipment
            </ButtonLink>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-6">
              <svg
                viewBox="0 0 540 400"
                role="img"
                aria-label="Illustration of a shipment journey: collected, origin gateway, in transit, customs cleared, delivered"
                className="h-auto w-full"
              >
                <defs>
                  <linearGradient id="journey-stroke" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0%" stopColor="#fb5c11" />
                    <stop offset="45%" stopColor="#598aff" />
                    <stop offset="100%" stopColor="#bcd1ff" />
                  </linearGradient>
                </defs>

                <g stroke="#ffffff" strokeOpacity="0.06" strokeWidth="1">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <line key={`h${i}`} x1="0" y1={i * 66 + 34} x2="540" y2={i * 66 + 34} />
                  ))}
                  {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <line key={`v${i}`} x1={i * 80 + 30} y1="0" x2={i * 80 + 30} y2="400" />
                  ))}
                </g>

                <motion.path
                  d={PATH}
                  fill="none"
                  stroke="url(#journey-stroke)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: reduce ? 0 : 2.2, ease: "easeInOut" }}
                />

                {STAGES.map((stage, i) => {
                  // Keep long labels inside the frame near the right edge.
                  const flip = stage.x > 380;
                  return (
                  <motion.g
                    key={stage.label}
                    initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.4, ease: EASE, delay: reduce ? 0 : 0.3 + i * 0.25 }}
                    style={{ transformOrigin: `${stage.x}px ${stage.y}px` }}
                  >
                    {stage.origin ? (
                      <circle cx={stage.x} cy={stage.y} r="16" fill="#fb5c11" fillOpacity="0.18">
                        {!reduce ? (
                          <animate
                            attributeName="r"
                            values="12;22;12"
                            dur="3s"
                            repeatCount="indefinite"
                          />
                        ) : null}
                      </circle>
                    ) : null}
                    <circle
                      cx={stage.x}
                      cy={stage.y}
                      r={stage.origin ? 7 : 5.5}
                      fill={stage.origin ? "#fb5c11" : "#ffffff"}
                    />
                    <text
                      x={stage.x + (flip ? -12 : 12)}
                      y={stage.y + 4}
                      textAnchor={flip ? "end" : "start"}
                      fill="#ffffff"
                      fontSize="13"
                      fontWeight="700"
                    >
                      {stage.label}
                    </text>
                    <text
                      x={stage.x + (flip ? -12 : 12)}
                      y={stage.y + 19}
                      textAnchor={flip ? "end" : "start"}
                      fill="#909cb0"
                      fontSize="10.5"
                      fontWeight="500"
                    >
                      {stage.note}
                    </text>
                  </motion.g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
