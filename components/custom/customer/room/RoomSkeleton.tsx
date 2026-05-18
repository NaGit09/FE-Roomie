import { Skeleton } from "@/components/ui/skeleton";

export const RoomSkeleton = () => (
  <div className="flex flex-col overflow-hidden rounded-[2rem] bg-white border border-slate-100 p-0">
    <Skeleton className="relative aspect-[1.2/1] w-full rounded-none" />
    <div className="flex flex-col p-7">
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <Skeleton className="h-4 w-20 rounded-full" />
          <Skeleton className="h-3 w-16 rounded-full" />
        </div>
        <Skeleton className="h-7 w-3/4 rounded-lg mt-2" />
        <Skeleton className="h-4 w-1/2 rounded-lg mt-3" />
      </div>
      <div className="mb-6 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
        <Skeleton className="h-8 w-16 rounded-xl" />
        <Skeleton className="h-8 w-20 rounded-xl" />
        <Skeleton className="h-8 w-16 rounded-xl" />
      </div>
      <div className="flex items-center justify-between mt-2">
        <Skeleton className="h-8 w-32 rounded-lg" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </div>
  </div>
);