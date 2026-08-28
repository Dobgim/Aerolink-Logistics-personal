"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { googleMapId, loadGoogleMaps } from "@/lib/maps/google-loader";
import {
  MARKER_COLORS,
  MARKER_LABELS,
  type MapPoint,
} from "./map-shared";

interface Props {
  points: MapPoint[];
  className?: string;
  heightClassName?: string;
  connect?: boolean;
  /** Called when Google fails, so the caller can fall back to another map. */
  onFailure?: () => void;
}

const PULSE_STYLE_ID = "royalprime-marker-pulse";

function ensurePulseKeyframes() {
  if (document.getElementById(PULSE_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = PULSE_STYLE_ID;
  style.textContent = `@keyframes royalprime-pulse{0%{box-shadow:0 0 0 0 rgba(251,92,17,.55)}70%{box-shadow:0 0 0 16px rgba(251,92,17,0)}100%{box-shadow:0 0 0 0 rgba(251,92,17,0)}}`;
  document.head.appendChild(style);
}

/** Builds the DOM element used as an advanced-marker's content. */
function markerElement(point: MapPoint): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.setAttribute("aria-label", `${MARKER_LABELS[point.kind]}: ${point.label}`);
  wrapper.style.cssText = [
    "width:18px",
    "height:18px",
    "border-radius:9999px",
    "border:3px solid #ffffff",
    `background:${MARKER_COLORS[point.kind]}`,
    "box-shadow:0 2px 8px rgba(11,14,20,.4)",
    "cursor:pointer",
    point.kind === "current" ? "animation:royalprime-pulse 2.4s ease-out infinite" : "",
  ]
    .filter(Boolean)
    .join(";");
  return wrapper;
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

/**
 * Live Google map: origin, current-location and destination markers with a
 * dashed great-circle-ish route between them. Falls back through `onFailure`
 * if the API cannot load, so the page is never left with an empty grey box.
 */
export function GoogleShipmentMap({
  points,
  className,
  heightClassName = "h-72 sm:h-96 lg:h-[28rem]",
  connect = true,
  onFailure,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || points.length === 0) return;

    let cancelled = false;
    const cleanups: (() => void)[] = [];

    void (async () => {
      try {
        const maps = await loadGoogleMaps();

        /*
         * With `loading=async`, `google.maps` is only a bootstrap stub: the
         * classes are attached by importLibrary, not by the script tag. Every
         * constructor therefore has to come from an imported library rather
         * than off the namespace directly.
         */
        const [core, mapsLib, markerLib] = await Promise.all([
          maps.importLibrary("core") as Promise<google.maps.CoreLibrary>,
          maps.importLibrary("maps") as Promise<google.maps.MapsLibrary>,
          maps.importLibrary("marker") as Promise<google.maps.MarkerLibrary>,
        ]);

        if (cancelled || !containerRef.current) return;
        ensurePulseKeyframes();

        const { LatLngBounds } = core;
        const { Map, Polyline, InfoWindow } = mapsLib;
        const { AdvancedMarkerElement } = markerLib;

        const map = new Map(containerRef.current, {
          mapId: googleMapId(),
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          // Vector maps show a tilt/heading puck plus a compass disc that
          // lands on top of Google's attribution. We have no use for either.
          cameraControl: false,
          rotateControl: false,
          tilt: 0,
          // Requires ctrl / two fingers to zoom, so the page still scrolls
          // normally when a map fills the width on a phone.
          gestureHandling: "cooperative",
          zoomControl: true,
        });

        if (points.length === 1) {
          map.setCenter({ lat: points[0].lat, lng: points[0].lng });
          map.setZoom(6);
        } else {
          const bounds = new LatLngBounds();
          for (const point of points) bounds.extend({ lat: point.lat, lng: point.lng });
          map.fitBounds(bounds, { top: 32, right: 32, bottom: 32, left: 32 });
        }

        if (connect && points.length > 1) {
          const route = new Polyline({
            path: points.map((p) => ({ lat: p.lat, lng: p.lng })),
            geodesic: true,
            strokeColor: "#1c3fd8",
            // Opacity 0 on the line itself leaves only the repeating dash
            // icons, which is how a dotted polyline is drawn in this API.
            strokeOpacity: 0,
            icons: [
              {
                icon: { path: "M 0,-1 0,1", strokeOpacity: 0.9, strokeWeight: 3, scale: 3 },
                offset: "0",
                repeat: "14px",
              },
            ],
          });
          route.setMap(map);
          cleanups.push(() => route.setMap(null));
        }

        const infoWindow = new InfoWindow();
        cleanups.push(() => infoWindow.close());

        for (const point of points) {
          const marker = new AdvancedMarkerElement({
            map,
            position: { lat: point.lat, lng: point.lng },
            content: markerElement(point),
            title: `${MARKER_LABELS[point.kind]}: ${point.label}`,
            zIndex: point.kind === "current" ? 3 : 1,
          });

          // `gmpClickable` also makes the marker keyboard-focusable, and
          // `gmp-click` is the supported event (plain "click" is deprecated).
          marker.gmpClickable = true;
          const onClick = () => {
            infoWindow.setContent(
              `<div style="font-family:system-ui,sans-serif;padding:2px 4px">
                 <strong style="display:block;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#6a7688">${MARKER_LABELS[point.kind]}</strong>
                 <span style="font-size:14px;font-weight:600;color:#151a22">${escapeHtml(point.label)}</span>
               </div>`,
            );
            infoWindow.open({ map, anchor: marker });
          };
          marker.addEventListener("gmp-click", onClick);

          cleanups.push(() => {
            marker.removeEventListener("gmp-click", onClick);
            marker.map = null;
          });
        }

        setReady(true);
      } catch (error) {
        // Surface the reason — a silent fallback makes a bad key, a disabled
        // API and a billing problem all look identical.
        console.warn("[map] Google Maps unavailable, falling back:", error);
        if (!cancelled) onFailure?.();
      }
    })();

    return () => {
      cancelled = true;
      for (const cleanup of cleanups) cleanup();
    };
  }, [points, connect, onFailure]);

  return (
    <div className={cn("relative overflow-hidden bg-ink-100", className)}>
      <div ref={containerRef} className={cn("w-full", heightClassName)} />
      {!ready ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink-100"
        >
          <span className="text-sm font-semibold text-ink-500">Loading map…</span>
        </div>
      ) : null}
    </div>
  );
}
