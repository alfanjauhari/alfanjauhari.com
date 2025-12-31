import { createMiddleware, json } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import { buildMiddlewareError } from "@/lib/error";
import { rateLimit } from "@/lib/rate-limit";

export const rateLimitMiddleware = (
  prefix: string,
  limit = 5,
  windowMs = 60_000,
) =>
  createMiddleware().server(async ({ next }) => {
    const clientIp =
      getRequestIP({
        xForwardedFor: true,
      }) || "unknown";

    const { ok } = await rateLimit({
      key: `rl:${prefix}:${clientIp}`,
      limit,
      windowMs,
    });

    if (!ok) {
      return next({
        context: {
          error: buildMiddlewareError({
            code: "TOO_MANY_REQUEST",
            message: "Too many request",
            status: 429,
          }),
        },
      });
    }

    return next();
  });
