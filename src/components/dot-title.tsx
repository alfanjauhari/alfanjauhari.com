import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const DotTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(function DotTitle({ children, className, ...props }, ref) {
  return (
    <h2
      className={cn(
        "text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2",
        className,
      )}
      {...props}
      ref={ref}
    >
      <span className="w-2 h-2 rounded-full bg-foreground"></span>
      {children}
    </h2>
  );
});
