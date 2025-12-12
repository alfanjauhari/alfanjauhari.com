import { createHash } from "node:crypto";
import path from "node:path";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { createIPX, ipxFSStorage } from "ipx";
import mime from "mime";

type IPXSegments =
  | Record<
      "format" | "f" | "quality" | "q" | "width" | "w" | "height" | "h" | "s",
      string
    >
  | undefined;

function parseIpxSegments(params: string) {
  const parts = params.split("/");

  const ipxIndex = parts.indexOf("_images");
  if (ipxIndex === -1) return undefined;

  const segment = parts[ipxIndex + 1] || "";
  if (!segment) return undefined;

  if (!segment.includes("_")) return undefined;

  const raw = segment.split(",").filter(Boolean);

  const entries = raw
    .map((s) => {
      const [key, ...rest] = s.split("_");
      const value = rest.join("_");

      return [key, value];
    })
    .filter(([key]) => !!key);

  if (!entries.length) return undefined;

  return Object.fromEntries(entries) as IPXSegments;
}

export const Route = createFileRoute("/_images/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { _splat } = params;

        if (!_splat) throw notFound();

        const ipx = createIPX({
          storage: ipxFSStorage({
            dir: path.join(process.cwd(), "public", "images"),
          }),
        });

        let id = _splat.split("/").slice(2).join("/");

        const segments = parseIpxSegments(_splat);

        if (!segments) {
          id = _splat.split("/").slice(1).join("/");
        }

        const { data, format } = await ipx(id, segments).process();

        if (typeof data === "string") {
          throw notFound();
        }

        const type = format
          ? mime.getType(format) || "application/octet-stream"
          : "application/octet-stream";

        const uint8 = new Uint8Array(data);

        return new Response(uint8, {
          headers: {
            "Content-Type": type,
            "Content-Length": String(uint8.byteLength),
            "Cache-Control": "public, max-age=31536000, immutable",
            ETag: createHash("md5").update(uint8).digest("hex"),
          },
          status: 200,
        });
      },
    },
  },
});
