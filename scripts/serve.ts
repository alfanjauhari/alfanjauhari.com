import { toNodeHandler as betterAuthNodeHandler } from "better-auth/node";
import compression from "compression";
import express, { type Request } from "express";
import { nanoid } from "nanoid";
import pino from "pino-http";
import type { NodeHttp1Handler } from "srvx";
import { toNodeHandler } from "srvx/node";
import { auth } from "@/lib/auth.server.js";
import logger from "@/lib/logger";
import { isDevAssetsRoutes, isStaticRoutes } from "@/lib/server.js";

const DEVELOPMENT = process.env.NODE_ENV === "development";
const PORT = Number.parseInt(process.env.PORT || "3000", 10);

const app = express();

app.use(
  pino({
    logger,
    serializers: {
      req: (req: Request) => ({
        method: req.method,
        url: req.url,
      }),
      responseTime: () => undefined,
    },
    customLogLevel: (req, res, err) => {
      if (res.statusCode >= 400 && res.statusCode < 500) {
        return "warn";
      } else if (res.statusCode >= 500 || err) {
        return "error";
      } else if (
        (res.statusCode >= 300 && res.statusCode < 400) ||
        isStaticRoutes(req.url) ||
        isDevAssetsRoutes(req.url)
      ) {
        return "silent";
      }

      return "info";
    },
    redact: ["res.headers.['set-cookie']"],
    genReqId: () => nanoid(),
  }),
);
app.all("/api/auth/*splat", betterAuthNodeHandler(auth));

if (DEVELOPMENT) {
  const viteDevServer = await import("vite").then((vite) =>
    vite.createServer({
      server: { middlewareMode: true },
    }),
  );
  app.use(viteDevServer.middlewares);
  app.use(async (req, res, next) => {
    try {
      const { default: serverEntry } =
        await viteDevServer.ssrLoadModule("./src/server.ts");
      const handler = toNodeHandler(serverEntry.fetch) as NodeHttp1Handler;
      await handler(req, res);
    } catch (error) {
      if (typeof error === "object" && error instanceof Error) {
        viteDevServer.ssrFixStacktrace(error);
      }
      next(error);
    }
  });
} else {
  // @ts-expect-error
  const { default: handler } = await import("../server/server.js");
  const nodeHandler = toNodeHandler(handler.fetch) as NodeHttp1Handler;

  app.use((req, res, next) => {
    const compress = compression();

    if (isStaticRoutes(req.url)) {
      return compress(req, res, next);
    }

    return next();
  });
  app.use("/", (req, res, next) => {
    if (isStaticRoutes(req.url)) {
      return express.static("dist/client", {
        immutable: true,
        maxAge: "1y",
      })(req, res, next);
    }

    return express.static("dist/client", {
      cacheControl: false,
      setHeaders: (res) => {
        res.setHeader("cache-control", "public, max-age=0, must-revalidate");
      },
    })(req, res, next);
  });
  app.use(async (req, res, next) => {
    try {
      await nodeHandler(req, res);
    } catch (error) {
      next(error);
    }
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
