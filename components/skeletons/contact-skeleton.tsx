import { Skeleton } from "@/components/ui/skeleton"

export function ContactSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Skeleton */}
      <div className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Skeleton className="h-8 w-32" />
            <div className="hidden md:flex space-x-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-16" />
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-8 md:hidden" />
            </div>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="relative h-64 md:h-80 bg-gray-100">
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <Skeleton className="h-12 w-48 mb-4 bg-white/20" />
            <Skeleton className="h-6 w-80 bg-white/20" />
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Form Column */}
            <div className="space-y-6">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-full" />

              <div className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-12 w-full" />
                </div>

                {/* Subject Field */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-12 w-full" />
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-32 w-full" />
                </div>

                {/* Submit Button */}
                <Skeleton className="h-12 w-full" />
              </div>
            </div>

            {/* Contact Info Column */}
            <div className="space-y-6">
              <Skeleton className="h-6 w-48" />

              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <Skeleton className="h-5 w-5 rounded-full flex-shrink-0 mt-1" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-4/5" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Skeleton */}
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-12 md:py-24 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg">
                <Skeleton className="h-5 w-48 mb-2" />
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
