import { BanIcon, MousePointer2 } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";

export function InteractiveTitle() {
  const [isEnabled, setIsEnabled] = useState(true);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 50, damping: 20 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [20, -20]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-20, 20]);

  // #region BEHOLD, USEEFFECTS!
  useEffect(() => {
    if (!isEnabled) return;

    const handleMouseMove = (event: MouseEvent) => {
      const normalizedX = event.clientX / window.innerWidth - 0.5;
      const normalizedY = event.clientY / window.innerHeight - 0.5;

      x.set(normalizedX);
      y.set(normalizedY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isEnabled, x, y]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (mediaQuery.matches) {
      setIsEnabled(false);
    }
  }, []);
  // #endregion

  return (
    <div className="relative block w-full">
      <button
        className="absolute -top-12 left-0 text-xs font-mono uppercase tracking-widest text-foreground hover:text-accent-foreground flex items-center gap-2 z-20 cursor-pointer"
        type="button"
        onClick={() => setIsEnabled((prev) => !prev)}
      >
        {isEnabled ? (
          <MousePointer2 className="size-4" />
        ) : (
          <BanIcon className="size-4" />
        )}
        {isEnabled ? "Motion On" : "Motion Off"}
      </button>

      <div className="relative perspective-distant py-4 flex justify-center">
        <motion.div
          style={{
            rotateX: isEnabled ? rotateX : 0,
            rotateY: isEnabled ? rotateY : 0,
            transformStyle: "preserve-3d",
          }}
          className="relative"
        >
          <h1 className="font-serif text-[24vw] lg:text-[18vw] leading-[0.8] tracking-tighter text-foreground select-none">
            Alfan <br />
            <span className="italic font-light ml-[4vw] md:ml-[8vw]">
              Jauhari
            </span>
          </h1>

          {isEnabled && (
            <motion.h1 className="font-serif text-[24vw] lg:text-[18vw] leading-[0.8] tracking-tighter text-foreground select-none absolute top-0 left-0 -z-10">
              Alfan <br />
              <span className="italic font-light ml-[4vw] md:ml-[8vw]">
                Jauhari
              </span>
            </motion.h1>
          )}
        </motion.div>
      </div>
    </div>
  );
}
