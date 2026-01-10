import express from "express";
import type { NodeHttp1Handler } from "srvx";
import { toNodeHandler } from "srvx/node";

const PORT = Number.parseInt(process.env.PORT || "3000", 10);

const app = express();

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
