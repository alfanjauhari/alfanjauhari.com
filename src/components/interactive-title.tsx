import { BanIcon, MousePointer2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function InteractiveTitle() {
  const [isEnabled, setIsEnabled] = useState(true);
  const ref = useRef<HTMLDivElement | null>(null);

  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(null);

  useEffect(() => {
    if (!isEnabled) return;

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX / window.innerWidth - 0.5;
      target.current.y = e.clientY / window.innerHeight - 0.5;
    };

    const animate = () => {
      current.current.x += (target.current.x - current.current.x) * 0.08;
      current.current.y += (target.current.y - current.current.y) * 0.08;

      const rx = current.current.y * -40;
      const ry = current.current.x * 40;

      if (ref.current) {
        ref.current.style.setProperty("--rx", `${rx}deg`);
        ref.current.style.setProperty("--ry", `${ry}deg`);
      }

      raf.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [isEnabled]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsEnabled(false);
    }
  }, []);

  return (
    <div className="relative block w-full">
      <button
        className="absolute -top-12 left-0 z-20 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-foreground hover:text-accent-foreground"
        onClick={() => setIsEnabled((v) => !v)}
        type="button"
      >
        {isEnabled ? (
          <MousePointer2 className="size-4" />
        ) : (
          <BanIcon className="size-4" />
        )}
        {isEnabled ? "Motion On" : "Motion Off"}
      </button>

      <div className="relative flex justify-center py-4 perspective-distant">
        <div
          ref={ref}
          className={[
            "relative transform-gpu preserve-3d",
            "motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out",
          ].join(" ")}
          style={{
            transform: isEnabled
              ? "rotateX(var(--rx)) rotateY(var(--ry))"
              : "rotateX(0deg) rotateY(0deg)",
          }}
        >
          {isEnabled ? (
            <>
              <p className="invisible select-none font-serif text-[24vw] lg:text-[18vw] leading-[0.8] tracking-tighter">
                Alfan <br />
                <span className="ml-[4vw] md:ml-[8vw] italic font-light">
                  Jauhari
                </span>
              </p>

              <h1 className="absolute inset-0 -z-10 select-none font-serif text-[24vw] lg:text-[18vw] leading-[0.8] tracking-tighter">
                Alfan <br />
                <span className="ml-[4vw] md:ml-[8vw] italic font-light">
                  Jauhari
                </span>
              </h1>
            </>
          ) : (
            <h1 className="select-none font-serif text-[24vw] lg:text-[18vw] leading-[0.8] tracking-tighter">
              Alfan <br />
              <span className="ml-[4vw] md:ml-[8vw] italic font-light">
                Jauhari
              </span>
            </h1>
          )}
        </div>
      </div>
    </div>
  );
}
