import { Skeleton } from "@/components/ui/skeleton";

export function ListFeedback() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Only for static loader
        <Skeleton className="w-full h-32" key={i} />
      ))}
    </div>
  );
}
