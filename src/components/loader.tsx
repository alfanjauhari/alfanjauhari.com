import {
  type HTMLMotionProps,
  motion,
  stagger,
  type Variants,
} from "motion/react";
import { forwardRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export const loaderContainerVariants: Variants = {
  show: {
    transition: {
      delayChildren: stagger(0.15),
    },
  },
  exit: {
    y: "-100%",
    transition: {
      ease: [0.76, 0, 0.24, 1],
      duration: 0.8,
      delay: 0.2,
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

export const Loader = forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div"> & { onComplete: () => void }
>(function Loader({ className, onComplete, ...props }, ref) {
  useEffect(() => {
    const timer = setTimeout(() => onComplete(), 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      key="loader"
      ref={ref}
      variants={loaderContainerVariants}
      initial="show"
      animate="show"
      exit="exit"
      className={cn(
        "fixed inset-0 z-100 flex flex-col justify-between p-6 md:p-12 overflow-hidden cursor-wait bg-background text-foreground",
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
            <motion.h1
              variants={textVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase"
            >
              Architecting
            </motion.h1>
          </div>

          <div className="overflow-hidden">
            <motion.h1
              variants={textVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase text-gray-500"
            >
              Tomorrow's
            </motion.h1>
          </div>

          <motion.div
            variants={lineVariants}
            className="h-px bg-border my-4 md:my-6 origin-left"
          />

          <div className="overflow-hidden flex justify-end">
            <motion.h1
              variants={textVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase text-right italic"
            >
              Digital
            </motion.h1>
          </div>

          <div className="overflow-hidden flex justify-end">
            <motion.h1
              variants={textVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase text-right text-gray-500 italic"
            >
              Landscape
            </motion.h1>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="border border-border rounded-full px-4 py-1 text-xs font-mono uppercase tracking-widest w-fit"
        >
          Loading...
        </motion.div>
      </div>
    </motion.div>
  );
});
