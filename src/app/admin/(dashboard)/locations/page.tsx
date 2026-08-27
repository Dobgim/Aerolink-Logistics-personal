import { Card } from "@/components/ui/primitives";
import { LocationsExplorer } from "@/components/locations/locations-explorer";
import { listLocations } from "@/lib/data/repository";
import { ALL_MARKETS } from "@/lib/constants/geo";

export const metadata = { title: "Locations" };
export const dynamic = "force-dynamic";

export default async function AdminLocationsPage() {
  const locations = await listLocations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink-900 sm:text-3xl">Locations</h1>
        <p className="mt-1.5 text-sm text-ink-600">
          {locations.length} service points across {ALL_MARKETS.length} markets. Search, filter and
          check coverage before quoting a route.
        </p>
      </div>

      <Card tone="info">
        <p className="text-sm text-brand-900">
          <strong className="font-bold">Coverage note:</strong> service points are the staffed
          counters. Delivery rounds extend to the surrounding towns listed on each card, so a town
          not shown here can still usually be served.
        </p>
      </Card>

      <LocationsExplorer locations={locations} />
    </div>
  );
}
