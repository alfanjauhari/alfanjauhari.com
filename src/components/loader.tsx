import {
  type HTMLMotionProps,
  motion,
  stagger,
  type Variants,
} from "motion/react";
import { useEffect } from "react";
import { setHasVisited } from "@/fns/client/common";
import { cn } from "@/lib/utils";

export const loaderContainerVariants: Variants = {
  show: {
    transition: {
      delayChildren: stagger(0.15),
    },
  },
};

export const textVariants: Variants = {
  hidden: { y: "100%", opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      ease: [0.33, 1, 0.68, 1],
      duration: 0.8,
    },
  },
  exit: {
    y: "-100%",
    opacity: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const lineVariants: Variants = {
  hidden: { width: 0 },
  show: {
    width: "100%",
    transition: { duration: 1.5, ease: "easeInOut", delay: 0.5 },
  },
};

export function Loader({ className, ...props }: HTMLMotionProps<"div">) {
  useEffect(() => {
    const timer = setTimeout(() => setHasVisited(true), 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      key="loader"
      variants={loaderContainerVariants}
      initial="show"
      animate="show"
      className={cn(
        "fixed inset-0 z-100 flex flex-col justify-between p-6 md:p-12 overflow-hidden cursor-wait bg-background text-foreground group-data-[has-visited=true]/root:-translate-y-full group-data-[has-visited=true]/root:ease-[cubic-bezier(0.76,0,0.24,1)] group-data-[has-visited=true]/root:duration-800",
        className,
      )}
      {...props}
    >
      <div className="flex justify-between items-start">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-xs font-mono uppercase tracking-widest"
        >
          Alfan Jauhari
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-xs font-mono uppercase tracking-widest flex gap-2"
        >
          <span>EST</span>
          <span>—</span>
          <span>{new Date().getFullYear()}</span>
        </motion.div>
      </div>

      <div className="flex flex-col justify-center flex-1 relative z-10">
        <div className="flex flex-col">
          <div className="overflow-hidden">
            <motion.p
              variants={textVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase"
            >
              Architecting
            </motion.p>
          </div>

          <div className="overflow-hidden">
            <motion.p
              variants={textVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase text-foreground/50"
            >
              Tomorrow's
            </motion.p>
          </div>

          <motion.div
            variants={lineVariants}
            className="h-px bg-border my-4 md:my-6 origin-left"
          />

          <div className="overflow-hidden flex justify-end">
            <motion.p
              variants={textVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase text-right italic"
            >
              Digital
            </motion.p>
          </div>

          <div className="overflow-hidden flex justify-end">
            <motion.p
              variants={textVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase text-right text-foreground/50 italic"
            >
              Landscape
            </motion.p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="border border-border rounded-full px-4 py-1 text-xs font-mono uppercase tracking-widest w-fit absolute bottom-0"
        >
          Loading Experience...
        </motion.div>
      </div>
    </motion.div>
  );
}
