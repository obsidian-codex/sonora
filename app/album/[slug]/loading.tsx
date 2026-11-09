import { Skeleton } from '@/components/sonora/primitives'

export default function AlbumLoading() {
  return (
    <main aria-busy="true" aria-label="Loading album" className="mx-auto max-w-7xl px-5 pt-20 lg:px-10 lg:pt-36">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-14">
        <Skeleton className="mx-auto aspect-square w-full max-w-sm lg:col-span-6 lg:max-w-none" />
        <div className="space-y-5 lg:col-span-6">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-16 w-4/5" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-14 w-48" />
          <div className="grid grid-cols-2 gap-4 pt-6 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-10" />
            ))}
          </div>
        </div>
      </div>
      <Skeleton className="mt-16 h-72 w-full lg:w-7/12" />
    </main>
  )
}
