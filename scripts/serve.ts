import { toNodeHandler as betterAuthNodeHandler } from "better-auth/node";
import compression from "compression";
import express, { type Request, type Response } from "express";
import { nanoid } from "nanoid";
import p from "pino";
import pino from "pino-http";
import type { NodeHttp1Handler } from "srvx";
import { toNodeHandler } from "srvx/node";
import { auth } from "@/lib/auth.server.js";
import logger from "@/lib/logger";

const DEVELOPMENT = process.env.NODE_ENV === "development";
const PORT = Number.parseInt(process.env.PORT || "3000", 10);

const app = express();

app.use(
  pino({
    logger,
    wrapSerializers: false,
    serializers: {
      req: (req: Request) => ({
        id: req.id,
        method: req.method,
        url: req.url,
      }),
      res: (res: Response) => {
        const stdSerializer = p.stdSerializers.res(res);
        const isStaticAssets = res.get("x-static-assets");

        if (DEVELOPMENT) return stdSerializer;
        if (isStaticAssets) return undefined;

        return stdSerializer;
      },
      responseTime: () => undefined,
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
  app.use(compression());
  app.use(
    "/",
    express.static("dist/client", {
      maxAge: "1y",
      setHeaders: (res) => {
        res.set("X-Static-Assets", "true");
      },
    }),
  );
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
