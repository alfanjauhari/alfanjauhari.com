import { type HtmlHTMLAttributes, useEffect } from "react";
import { setHasVisited } from "@/fns/client/common";
import { cn } from "@/lib/utils";

export function Loader({
  className,
  ...props
}: HtmlHTMLAttributes<HTMLDivElement>) {
  useEffect(() => {
    const timer = setTimeout(() => setHasVisited(true), 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      key="loader"
      className={cn(
        "fixed inset-0 z-100 flex flex-col justify-between p-6 md:p-12 overflow-hidden cursor-wait bg-background text-foreground group-data-[has-visited=true]/root:-translate-y-full group-data-[has-visited=true]/root:duration-800",
        className,
      )}
      {...props}
    >
      <div className="flex justify-between items-start">
        <div className="text-xs font-mono uppercase tracking-widest">
          Alfan Jauhari
        </div>
        <div className="text-xs font-mono uppercase tracking-widest flex gap-2">
          <span>EST</span>
          <span>—</span>
          <span>{new Date().getFullYear()}</span>
        </div>
      </div>

      <div className="flex flex-col justify-center flex-1 relative z-10">
        <div className="flex flex-col">
          <div className="motion-opacity-in-0 motion-duration-1000">
            <p className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase">
              Architecting
            </p>
            <p className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase text-foreground/50">
              Tomorrow's
            </p>
          </div>

          <div className="h-px bg-border my-4 md:my-6" />

          <div className="motion-opacity-in-0 motion-duration-1000 justify-end">
            <p className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase text-right italic">
              Digital
            </p>
            <p className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase text-right text-foreground/50 italic">
              Landscape
            </p>
          </div>
        </div>

        <div className="border border-border rounded-full px-4 py-1 text-xs font-mono uppercase tracking-widest w-fit absolute bottom-0 motion-opacity-in-0 motion-delay-1000">
          Loading Experience...
        </div>
      </div>
    </div>
  );
}
