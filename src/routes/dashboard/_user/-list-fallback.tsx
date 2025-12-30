import type { PropsWithChildren } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function ListFeedback({ children }: PropsWithChildren) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {children}
        <Skeleton className="size-6 rounded-full bg-foreground/10 text-xs flex items-center justify-center" />
      </div>
      <hr />
      {Array.from({ length: 2 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Only for static loader
        <Skeleton className="w-full h-32" key={i} />
      ))}
    </div>
  );
}
