"use client";

/**
 * Loads the Google Maps JavaScript API exactly once per page, no matter how
 * many map components mount. Every caller shares the same promise.
 *
 * The key is a `NEXT_PUBLIC_` value because the Maps JS API runs in the
 * browser and the key necessarily ships with the page — Google's model is to
 * restrict the key by HTTP referrer in the Cloud console rather than to keep
 * it secret. See the README for the restriction steps.
 */

const CALLBACK = "__aerolinkGoogleMapsReady";

let loaderPromise: Promise<typeof google.maps> | null = null;

/** Set by Google when the key is rejected (invalid, unrestricted, unbilled). */
let authFailed = false;

declare global {
  interface Window {
    gm_authFailure?: () => void;
    [CALLBACK]?: () => void;
  }
}

export function googleMapsKey(): string {
  return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
}

/**
 * Advanced markers require a Map ID. `DEMO_MAP_ID` works out of the box but is
 * documented by Google as development-only, so a real cloud-styled ID can be
 * supplied through the environment.
 */
export function googleMapId(): string {
  return process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID";
}

export function googleAuthFailed(): boolean {
  return authFailed;
}

export function loadGoogleMaps(): Promise<typeof google.maps> {
  if (loaderPromise) return loaderPromise;

  const key = googleMapsKey();
  if (!key) {
    return Promise.reject(new Error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set"));
  }

  loaderPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Google Maps can only load in the browser"));
      return;
    }

    // Already fully initialised (e.g. a client-side navigation back to a map).
    if (typeof window.google?.maps?.importLibrary === "function") {
      resolve(window.google.maps);
      return;
    }

    const timeout = window.setTimeout(() => {
      loaderPromise = null;
      reject(new Error("Google Maps did not initialise within 20s"));
    }, 20_000);

    const settle = () => {
      window.clearTimeout(timeout);
      if (typeof window.google?.maps?.importLibrary === "function") {
        resolve(window.google.maps);
      } else {
        loaderPromise = null;
        reject(new Error("Google Maps loaded without importLibrary"));
      }
    };

    // Google invokes this global when it rejects the key. Without it, a bad
    // key fails silently and leaves an empty grey box on the page.
    window.gm_authFailure = () => {
      authFailed = true;
      loaderPromise = null;
      window.clearTimeout(timeout);
      reject(new Error("Google Maps rejected the API key"));
    };

    /*
     * The API is only ready when it invokes `callback` — the script tag's own
     * `load` event fires earlier, while `google.maps` is still a bootstrap
     * stub without `importLibrary`.
     */
    window[CALLBACK] = settle;

    if (document.querySelector("script[data-google-maps]")) {
      // A previous mount is still loading; its callback will settle us too.
      return;
    }

    const params = new URLSearchParams({
      key,
      v: "weekly",
      libraries: "marker",
      loading: "async",
      callback: CALLBACK,
    });

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    script.async = true;
    script.dataset.googleMaps = "true";
    script.addEventListener("error", () => {
      loaderPromise = null;
      window.clearTimeout(timeout);
      reject(new Error("Failed to load the Google Maps script"));
    });

    document.head.appendChild(script);
  });

  return loaderPromise;
}
