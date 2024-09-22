import clsx from "clsx";
import { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Conditionally joins multiple class names together.
 *
 * @param {...ClassValue} classes - variable number of class names
 * @return {string} merged class name string
 */
export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(...classes));
}
