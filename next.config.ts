import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

/*
 * The brand artwork is optional. Detecting it at build time means the header and
 * footer never request a file that is not there — a missing asset would 404 on
 * every page load and keep the network from ever going idle.
 */
const BRAND_LOGO = "/brand/royal-prime-logo.png";
const BRAND_EMBLEM = "/brand/emblem-64.png";
const exists = (p: string) => fs.existsSync(path.join(process.cwd(), "public", p));
const brandLogoExists = exists(BRAND_LOGO);
const brandEmblemExists = exists(BRAND_EMBLEM);

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BRAND_LOGO: brandLogoExists ? BRAND_LOGO : "",
    NEXT_PUBLIC_BRAND_EMBLEM: brandEmblemExists ? BRAND_EMBLEM : "",
  },
  reactStrictMode: true,
  poweredByHeader: false,
  // Pin the workspace root so Turbopack ignores unrelated lockfiles further up
  // the directory tree.
  turbopack: { root: path.resolve(process.cwd()) },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    // Photography is served straight from Unsplash's resizing CDN — see the
    // loader for why. remotePatterns stays declared so the host is explicit.
    loader: "custom",
    loaderFile: "./src/lib/images/unsplash-loader.ts",
    deviceSizes: [320, 375, 430, 640, 768, 1024, 1280, 1440, 1920, 2560],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
