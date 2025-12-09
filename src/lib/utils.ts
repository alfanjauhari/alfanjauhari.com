import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateUniqueId(data: unknown) {
  const jsonString = JSON.stringify(data);

  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(jsonString);

  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}
