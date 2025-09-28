import { Skeleton } from "@/components/ui/skeleton"

export default function DonateLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="w-full h-[300px] bg-gray-200 animate-pulse" />

      <div className="container px-4 md:px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div>
            <Skeleton className="h-10 w-2/3 mb-4" />
            <Skeleton className="h-20 w-full mb-4" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>

          <div>
            <Skeleton className="h-8 w-1/3 mb-4" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
