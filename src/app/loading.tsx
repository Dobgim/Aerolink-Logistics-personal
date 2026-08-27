import { Skeleton } from "@/components/ui/primitives";

export default function Loading() {
  return (
    <div
      className="mx-auto w-full max-w-[85rem] px-4 py-16 sm:px-6 lg:px-8"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading…</span>
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-4 h-10 w-3/4 max-w-xl" />
      <Skeleton className="mt-3 h-5 w-full max-w-2xl" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-56 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
