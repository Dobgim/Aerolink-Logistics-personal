import type { NextRequest } from "next/server";
import { listLocations } from "@/lib/data/repository";
import { handle, ok } from "@/lib/api/respond";

export const dynamic = "force-dynamic";

/** Public directory of service points, filterable by country, city or free text. */
export async function GET(request: NextRequest) {
  return handle(async () => {
    const { searchParams } = new URL(request.url);
    const locations = await listLocations({
      country: searchParams.get("country") ?? undefined,
      city: searchParams.get("city") ?? undefined,
      search: searchParams.get("search") ?? undefined,
    });

    return ok({ locations, total: locations.length });
  });
}
