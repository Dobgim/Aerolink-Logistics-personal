# Brand artwork

The FreightCargoXpress mark is **drawn, not raster**. It lives in two places
that must be kept in step:

  * `public/icon.svg` — the favicon and iOS touch icon
  * `LogoMark` in `src/components/layout/logo.tsx` — the header and footer mark

Because it is an SVG it stays sharp from a 16px favicon up to the footer, needs
no size variants, and costs a few hundred bytes rather than tens of kilobytes.
There is nothing to regenerate when the design changes.

## Optional raster override

`next.config.ts` looks for `freightcargoxpress-logo.png` and `emblem-64.png`
here at build time, and only sets `NEXT_PUBLIC_BRAND_LOGO` /
`NEXT_PUBLIC_BRAND_EMBLEM` when they exist — a missing file never 404s on every
page load. Drop those files in and the header and footer switch to the artwork
automatically; leave them out and the drawn mark is used.

If you do add artwork, supply the emblem at 32, 64 and 180px, and crop it to
the mark alone — a wordmark is unreadable at 32px.
