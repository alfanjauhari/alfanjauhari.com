import type { HTMLMotionProps } from "motion/react";

export const NAVIGATIONS = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/updates", label: "Updates" },
  {
    path: "/snippets",
    label: "Snippets",
  },
];

export const PAGE_TRANSITIONS: HTMLMotionProps<"div"> = {
  transition: {
    duration: 0.6,
    ease: [0.22, 1, 0.36, 1],
  },
  exit: {
    opacity: 0,
    y: -20,
  },
  animate: { opacity: 1, y: 0 },
  initial: { opacity: 0, y: 20 },
};
