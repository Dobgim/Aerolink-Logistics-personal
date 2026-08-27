/**
 * Photography is served from Unsplash under the Unsplash License (free for
 * commercial use, no attribution required). Every id below was verified to
 * resolve; `next.config.ts` whitelists the host for the Image optimizer.
 *
 * No third-party courier branding, logos or copyrighted assets are used
 * anywhere in this project — the AeroLink identity is entirely original.
 */
const U = "https://images.unsplash.com/photo-";

/**
 * Unsplash originals are 10–20 MB, which blows past the Image optimizer's
 * upstream fetch timeout. Asking Unsplash for a 2000px web-ready rendition
 * first keeps the optimizer fast; it still resizes down per breakpoint.
 */
const SRC = "?auto=format&fit=crop&w=2000&q=80";

export const IMAGES = {
  heroPort: `${U}1578575437130-527eed3abbec${SRC}`,
  freighterLoading: `${U}1583911026662-95161686d9a6${SRC}`,
  airportCargo: `${U}1508053803120-e3e60f3f9674${SRC}`,
  aircraftSky: `${U}1570710891163-6d3b5c47248b${SRC}`,
  truckHighway: `${U}1601584115197-04ecc0da31d7${SRC}`,
  truckMountain: `${U}1519003722824-194d4455a60c${SRC}`,
  warehouse: `${U}1586528116311-ad8dd3c8310d${SRC}`,
  warehouseDark: `${U}1587293852726-70cdb56c2866${SRC}`,
  parcels: `${U}1580674285054-bed31e145f59${SRC}`,
  handover: `${U}1566576721346-d4a3b4eaeb55${SRC}`,
  loadedVan: `${U}1620455800201-7f00aeef12ed${SRC}`,
  lastMile: `${U}1607130232670-52123ba5be5c${SRC}`,
  europeAerial: `${U}1502991644659-e8aa151f8389${SRC}`,
  containerShip: `${U}1605745341112-85968b19335b${SRC}`,
  business: `${U}1600880292203-757bb62b4baf${SRC}`,
  handshake: `${U}1521791136064-7986c2920216${SRC}`,
  doorstep: `${U}1614018453562-77f6180ce036${SRC}`,
} as const;

export type ImageKey = keyof typeof IMAGES;

/** Ask Unsplash for exactly the pixels we need, in a modern format. */
export function photo(key: ImageKey, width: number, quality = 70): string {
  return `${IMAGES[key].split("?")[0]}?auto=format&fit=crop&w=${width}&q=${quality}`;
}

/**
 * A 20px blurred inline data URI is not available for remote files, so we use
 * a flat brand-tinted placeholder to avoid layout flashes on slow connections.
 */
export const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4IDUiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjUiIGZpbGw9IiMxNDJjOGIiLz48L3N2Zz4=";
