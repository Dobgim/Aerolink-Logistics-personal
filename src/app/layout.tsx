import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { SITE } from "@/lib/constants/site";
import { ToastProvider } from "@/components/ui/toast";

const BRAND_LOGO = process.env.NEXT_PUBLIC_BRAND_LOGO ?? "";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "international shipping",
    "shipment tracking",
    "international courier",
    "air freight",
    "cargo shipping",
    "door to door delivery",
    "track parcel",
  ],
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  /*
   * The brand artwork doubles as the favicon and touch icon once it is dropped
   * into `public/brand/` — `next.config.ts` sets the variable only when the
   * file actually exists, so we never ship a broken icon reference.
   */
  icons: BRAND_LOGO
    ? {
        icon: [
          { url: BRAND_LOGO, type: "image/png" },
          { url: "/icon.svg", type: "image/svg+xml" },
        ],
        shortcut: [{ url: BRAND_LOGO }],
        apple: [{ url: BRAND_LOGO }],
      }
    : {
        icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
        apple: [{ url: "/icon.svg" }],
      },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0f2166",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="skip-link absolute left-4 top-4 z-100 rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white"
        >
          Skip to main content
        </a>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
