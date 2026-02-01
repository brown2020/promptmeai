import { cn } from "@/utils/tailwind";

interface SkeletonProps {
  className?: string;
}

/**
 * Base skeleton component for loading states.
 * Uses pulse animation to indicate loading.
 */
export const Skeleton = ({ className }: SkeletonProps) => (
  <div
    className={cn(
      "animate-pulse bg-gray-200 dark:bg-gray-700 rounded",
      className
    )}
  />
);

/**
 * Skeleton for chat list items.
 * Shows placeholder for chat avatar, title, and timestamp.
 */
export const ChatListSkeleton = () => (
  <div className="flex flex-col gap-3 p-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

/**
 * Skeleton for chat response cards.
 * Shows placeholder for AI model responses.
 */
export const ChatResponseSkeleton = () => (
  <div className="flex flex-col gap-4 p-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="w-6 h-6 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    ))}
  </div>
);

/**
 * Skeleton for settings page sections.
 */
export const SettingsSkeleton = () => (
  <div className="space-y-6 p-4">
    <div className="space-y-3">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
    <div className="space-y-3">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
    <div className="space-y-3">
      <Skeleton className="h-6 w-36" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-10 rounded-lg" />
        <Skeleton className="h-10 rounded-lg" />
      </div>
    </div>
  </div>
);

export default Skeleton;
