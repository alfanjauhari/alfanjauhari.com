import { nanoid } from "nanoid";
import { redis } from "./redis";

export interface RateLimitOptions {
  key: string;
  limit: number;
  windowMs: number;
}

function shouldBypassRateLimit() {
  return (
    process.env.SKIP_RATE_LIMIT === "1" ||
    process.env.SKIP_RATE_LIMIT === "true" ||
    process.env.npm_lifecycle_event === "build"
  );
}

const slidingWindowScript = `
  -- sliding_window.lua
  -- KEYS[1] = rate limit key
  -- ARGV[1] = now (ms)
  -- ARGV[2] = window (ms)
  -- ARGV[3] = limit
  -- ARGV[4] = request_id

  redis.call("ZREMRANGEBYSCORE", KEYS[1], 0, ARGV[1] - ARGV[2])

  local count = redis.call("ZCARD", KEYS[1])

  if count >= tonumber(ARGV[3]) then
    return {0, count}
  end

  redis.call("ZADD", KEYS[1], ARGV[1], ARGV[4])
  redis.call("PEXPIRE", KEYS[1], ARGV[2])

  return {1, count + 1}
`;

export async function rateLimit({ key, limit, windowMs }: RateLimitOptions) {
  if (shouldBypassRateLimit()) {
    return {
      ok: true,
      remaining: limit,
    };
  }

  const now = Date.now();
  const requestId = nanoid();

  const [allowed, count] = await redis
    .eval(slidingWindowScript, 1, key, now, windowMs, limit, requestId)
    .then((res) => res as [number, number]);

  return {
    ok: allowed === 1,
    remaining: Math.max(0, limit - count),
  };
}
