import Link from "next/link";
import { Mail, MapPin, PhoneCall } from "lucide-react";
import { SITE } from "@/lib/constants/site";
import { Logo } from "./logo";
import { Container } from "@/components/ui/primitives";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/about#careers" },
      { label: "News", href: "/about#news" },
      { label: "Sustainability", href: "/about#sustainability" },
    ],
  },
  {
    title: "Shipping",
    links: [
      { label: "Ship Now", href: "/shipping" },
      { label: "Shipping Services", href: "/services" },
      { label: "International Shipping", href: "/services#express_international" },
      { label: "Cargo", href: "/services#cargo_freight" },
    ],
  },
  {
    title: "Tracking",
    links: [
      { label: "Track Shipment", href: "/tracking" },
      { label: "Shipment History", href: "/tracking#history" },
      { label: "Delivery Information", href: "/shipping#delivery" },
    ],
  },
  {
    title: "Network",
    links: [
      { label: "Find a Service Point", href: "/locations" },
      { label: "Coverage", href: "/locations#coverage" },
      { label: "Transit Times", href: "/services" },
      { label: "Delivery Information", href: "/shipping#delivery" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/contact#help" },
      { label: "Contact Us", href: "/contact" },
      { label: "FAQs", href: "/contact#faqs" },
    ],
  },
];

/**
 * Monogram social links. Platform logos are trademarked artwork, so we link out
 * with plain lettermarks instead of reproducing anyone's brand assets.
 */
const SOCIALS = [
  { label: "FreightCargoXpress on X", href: SITE.social.x, mark: "X" },
  { label: "FreightCargoXpress on LinkedIn", href: SITE.social.linkedin, mark: "in" },
  { label: "FreightCargoXpress on Facebook", href: SITE.social.facebook, mark: "f" },
  { label: "FreightCargoXpress on Instagram", href: SITE.social.instagram, mark: "ig" },
];

export function Footer() {
  const year = new Date().getUTCFullYear();

  return (
    <footer className="border-t border-ink-800 bg-ink-950 text-ink-300">
      <Container className="py-14 sm:py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)]">
          <div className="max-w-sm">
            <Logo tone="light" href="/" size="lg" />
            <p className="mt-5 text-sm leading-relaxed text-ink-400">
              FreightCargoXpress moves express parcels, freight and e-commerce orders worldwide —
              with a scan-level tracking record on every consignment.
            </p>

            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-400" />
                <span className="text-ink-400">{SITE.address}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <PhoneCall aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-400" />
                <a
                  href={`tel:${SITE.phoneHref}`}
                  className="text-ink-300 transition-colors hover:text-white"
                >
                  {SITE.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-400" />
                <a
                  href={`mailto:${SITE.email}`}
                  className="break-all text-ink-300 transition-colors hover:text-white"
                >
                  {SITE.email}
                </a>
              </li>
            </ul>

            <ul className="mt-7 flex items-center gap-2.5">
              {SOCIALS.map(({ label, href, mark }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex size-10 items-center justify-center rounded-lg border border-ink-800 text-sm font-bold lowercase text-ink-400 transition-colors hover:border-brand-500 hover:bg-brand-950 hover:text-white"
                  >
                    <span aria-hidden>{mark}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
            {COLUMNS.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h3 className="text-[0.8125rem] font-bold uppercase tracking-[0.12em] text-white">
                  {column.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-ink-400 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
      </Container>

      <div className="border-t border-ink-900">
        <Container className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-500">
            © {year} {SITE.name}. A fictional logistics brand created for this project.
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <li>
              <Link href="/legal/privacy" className="text-ink-400 transition-colors hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/legal/terms" className="text-ink-400 transition-colors hover:text-white">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/legal/cookies" className="text-ink-400 transition-colors hover:text-white">
                Cookie Policy
              </Link>
            </li>
          </ul>
        </Container>
      </div>
    </footer>
  );
}
