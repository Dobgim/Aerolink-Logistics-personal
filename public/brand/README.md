# Brand artwork

Save the Royal Prime Logistics logo in this folder as:

    royal-prime-logo.png

Then restart the dev server (or rebuild). That single file drives:

  * the header logo
  * the footer logo
  * the browser favicon and the iOS touch icon

`next.config.ts` checks for the file at build time and sets
`NEXT_PUBLIC_BRAND_LOGO` only when it is actually present, so nothing 404s
while the file is missing. Until then `src/components/layout/logo.tsx` falls
back to a drawn mark plus the text wordmark.

Notes:
  * A transparent-background PNG works best. 512x512 or larger.
  * The artwork already contains the wordmark, so the header and footer show
    the image on its own — no duplicated company name.
