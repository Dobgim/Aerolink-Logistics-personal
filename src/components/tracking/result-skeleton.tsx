import { Card, Skeleton } from "@/components/ui/primitives";

export function TrackingResultSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-live="polite">
      <span className="sr-only">Searching for your shipment…</span>

      <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card">
        <div className="bg-ink-100 px-5 py-6 sm:px-7">
          <Skeleton className="h-3 w-28 bg-ink-300/70" />
          <Skeleton className="mt-3 h-8 w-52 bg-ink-300/70" />
          <Skeleton className="mt-3 h-4 w-40 bg-ink-300/70" />
          <Skeleton className="mt-6 h-1.5 w-full bg-ink-300/70" />
        </div>
        <div className="grid gap-5 px-5 py-6 sm:grid-cols-2 sm:px-7 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i}>
              <Skeleton className="h-3 w-20" />
              <Skeleton className="mt-2 h-4 w-32" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <Card padded={false} className="overflow-hidden">
          <Skeleton className="h-72 w-full rounded-none sm:h-96" />
        </Card>
        <Card>
          <Skeleton className="h-4 w-32" />
          <div className="mt-6 space-y-6">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="size-10 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
