import fs from "node:fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";
import { redis } from "./redis";

export interface RateLimitOptions {
  key: string;
  limit: number;
  windowMs: number;
}

export async function rateLimit({ key, limit, windowMs }: RateLimitOptions) {
  const now = Date.now();
  const requestId = nanoid();

  const slidingWindowScript = await fs.readFile(
    path.join(process.cwd(), "src/lib/__assets/rate-limit.lua"),
    "utf8",
  );

  const [allowed, count] = await redis
    .eval(slidingWindowScript, 1, key, now, windowMs, limit, requestId)
    .then((res) => res as [number, number]);

  return {
    ok: allowed === 1,
    remaining: Math.max(0, limit - count),
  };
}
