import compression from "compression";
import express from "express";
import type { NodeHttp1Handler } from "srvx";
import { toNodeHandler } from "srvx/node";

const PORT = Number.parseInt(process.env.PORT || "3000", 10);

const app = express();

// @ts-expect-error
const { default: handler } = await import("../dist/server/server.js");
const nodeHandler = toNodeHandler(handler.fetch) as NodeHttp1Handler;
app.use(compression());
app.use(
  "/",
  express.static("dist/client", {
    maxAge: "1y",
  }),
);
app.use(async (req, res, next) => {
  try {
    await nodeHandler(req, res);
  } catch (error) {
    next(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
