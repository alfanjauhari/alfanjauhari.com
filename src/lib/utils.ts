import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["xxs"],
    },
  },
});
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms = 1000) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function formatDate(date: Date | number) {
  return new Intl.DateTimeFormat("id-ID").format(date);
}

export function formatLocalTime(date: Date, timezone: string) {
  try {
    return {
      time: new Intl.DateTimeFormat("id-ID", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
      }).format(date),
      day: new Intl.DateTimeFormat("id-ID", {
        timeZone: timezone,
        weekday: "short",
        day: "numeric",
        month: "short",
      }).format(date),
    };
  } catch {
    return {
      time: new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(date),
      day: new Intl.DateTimeFormat("id-ID", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }).format(date),
    };
  }
}
