"use client";

import type { ImageLoaderProps } from "next/image";

/**
 * Custom Next.js image loader.
 *
 * Every photograph in this project is served from Unsplash, which is already a
 * resizing image CDN: `w` picks the rendition and `auto=format` negotiates AVIF
 * or WebP per browser. Pointing `next/image` straight at it means we still get
 * a full responsive `srcset`, but without proxying multi-megabyte originals
 * through our own server on a cold cache — which is both slower for visitors
 * and, on Vercel, billable image-optimization work.
 *
 * Local assets under `/` are returned untouched.
 */
export default function unsplashLoader({ src, width, quality }: ImageLoaderProps): string {
  if (src.startsWith("/")) return src;

  const [base] = src.split("?");
  const params = new URLSearchParams({
    auto: "format",
    fit: "crop",
    w: String(width),
    q: String(quality ?? 70),
  });

  return `${base}?${params.toString()}`;
}
