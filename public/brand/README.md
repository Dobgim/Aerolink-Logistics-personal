# Brand artwork

`royal-prime-logo.png` is the header and footer lockup. The `emblem-*.png`
files are the favicon and iOS touch icon.

All of them are generated from the original 1254x1254 export:

  * the transparent margin is trimmed so the mark fills its box
  * the lockup is resized to 512px and palette-quantised
    (1.08 MB -> 69 KB, no visible quality loss)
  * the emblem — crown, monogram and globe, without the wordmark — is cropped
    for the icons, because three lines of text are unreadable at 32px

`next.config.ts` checks for `royal-prime-logo.png` at build time and only then
sets `NEXT_PUBLIC_BRAND_LOGO`, so a missing file never 404s on every page load.
Replacing the artwork means dropping in a new `royal-prime-logo.png` and
regenerating the emblems at 32, 64 and 180px.
