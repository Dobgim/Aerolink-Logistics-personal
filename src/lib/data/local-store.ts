import "server-only";

import { buildSeed, type SeedData } from "./seed";

/**
 * In-process data store used when no Supabase project is configured.
 *
 * It exists so the whole product — including admin writes — is fully
 * exercisable out of the box. Set the Supabase environment variables and every
 * repository call switches to the real database instead (see `repository.ts`);
 * nothing else in the app changes. The store is intentionally process-local and
 * resets on restart, so it is a development-only backend, not a production one.
 */
declare global {
  var __royalPrimeStore: SeedData | undefined;
}

export function store(): SeedData {
  if (!globalThis.__royalPrimeStore) {
    globalThis.__royalPrimeStore = buildSeed();
  }
  return globalThis.__royalPrimeStore;
}

export function nextId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}
