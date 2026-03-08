import { Skeleton } from "@/components/ui/skeleton";

export function CardGridSkeleton({ count = 6, imageHeightClass = "h-44" }: { count?: number; imageHeightClass?: string }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <article key={`card-skeleton-${index}`} className="overflow-hidden bg-card">
          <Skeleton className={`w-full ${imageHeightClass}`} />
          <div className="space-y-3 p-6">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </article>
      ))}
    </>
  );
}

export function BulletListSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <li key={`bullet-skeleton-${index}`} className="flex items-center gap-3">
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-4 w-full" />
        </li>
      ))}
    </>
  );
}

export function DetailPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative flex min-h-[340px] items-end">
        <Skeleton className="absolute inset-0 h-full w-full" />
        <div className="container relative z-10 mx-auto px-4 pb-12 pt-24 lg:px-8">
          <Skeleton className="h-4 w-28 bg-white/30" />
          <Skeleton className="mt-3 h-14 w-4/5 max-w-3xl bg-white/30" />
        </div>
      </section>
      <section className="bg-background py-16">
        <div className="container mx-auto grid gap-8 px-4 lg:grid-cols-[2fr,1fr] lg:px-8">
          <article className="space-y-4 bg-card p-8">
            <Skeleton className="h-8 w-52" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="mt-4 h-7 w-40" />
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={`detail-outcome-${index}`} className="h-4 w-5/6" />
            ))}
          </article>
          <aside className="space-y-3 bg-card p-8">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="mt-3 h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </aside>
        </div>
      </section>
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <Skeleton className="h-12 w-full" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={`admin-row-${index}`} className="space-y-3 bg-card p-6">
              <Skeleton className="h-5 w-72" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-10/12" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-9 w-28" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
