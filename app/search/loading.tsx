import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950 pb-16 md:pb-0">
      <div className="container mx-auto px-4 py-6">
        <div className="h-6 w-24 mb-6">
          <Skeleton className="h-full w-full" />
        </div>

        <div className="flex flex-col items-center justify-center mb-8">
          <Skeleton className="h-10 w-64 mb-6" />
          <div className="w-full max-w-3xl flex gap-2">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-14" />
          </div>
        </div>

        <Skeleton className="h-12 w-full mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-purple-100 dark:border-purple-900">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-32 mb-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <Skeleton className="h-5 w-40 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-3/4 mt-1" />
              </div>

              <div className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <Skeleton className="h-5 w-40 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-3/4 mt-1" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-100 dark:border-purple-900">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-32 mb-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-40 mt-1" />
                  </div>
                </div>
              </div>

              <div className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-40 mt-1" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
