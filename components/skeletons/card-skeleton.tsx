import { Skeleton } from "@/components/ui/skeleton"

export function CardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <Skeleton className="h-6 w-3/4 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-4" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  )
}

export function EventCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-4" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  )
}

export function ProgramCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <Skeleton className="h-40 w-full" />
      <div className="p-6">
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-4" />
        <div className="flex flex-wrap gap-2 mb-4">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-14" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}
