import type { HTMLMotionProps } from "motion/react";

export const NAVIGATIONS = [
  { path: "/", label: "Work" },
  { path: "/about", label: "About" },
  { path: "/updates", label: "Updates" },
];

export const FEATURED_WORKS = [
  {
    id: "01",
    title: "Bakti DNA",
    slug: "bakti-dna",
    year: 2022,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident, id culpa repellendus, eius harum expedita laborum vel obcaecati laudantium magnam tempore eveniet aperiam accusamus quasi dignissimos at quidem vero totam!",
    tags: ["NextJS", "TypeScript", "TailwindCSS"],
  },
  {
    id: "02",
    title: "Bakti DNA",
    slug: "bakti-dna",
    year: 2022,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident, id culpa repellendus, eius harum expedita laborum vel obcaecati laudantium magnam tempore eveniet aperiam accusamus quasi dignissimos at quidem vero totam!",
    tags: ["NextJS", "TypeScript", "TailwindCSS"],
  },
  {
    id: "03",
    title: "Bakti DNA",
    slug: "bakti-dna",
    year: 2022,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident, id culpa repellendus, eius harum expedita laborum vel obcaecati laudantium magnam tempore eveniet aperiam accusamus quasi dignissimos at quidem vero totam!",
    tags: ["NextJS", "TypeScript", "TailwindCSS"],
  },
  {
    id: "04",
    title: "Bakti DNA",
    slug: "bakti-dna",
    year: 2022,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident, id culpa repellendus, eius harum expedita laborum vel obcaecati laudantium magnam tempore eveniet aperiam accusamus quasi dignissimos at quidem vero totam!",
    tags: ["NextJS", "TypeScript", "TailwindCSS"],
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
