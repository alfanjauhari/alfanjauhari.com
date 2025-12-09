import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "@takumi-rs/image-response";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { allUpdates, allWorks } from "content-collections";
import z from "zod";
import OGTemplate from "@/components/og-template";

const ALLOWED_OG_ROUTES = [
  {
    path: "home",
    type: "home" as const,
  },
  {
    path: "about",
    type: "page" as const,
    title: "About",
  },
  {
    path: "updates",
    type: "page" as const,
    title: "Updates",
    meta: "A collection of my thoughts on software engineering, design systems, and the intersection of humanity and technology.",
  },
  ...allUpdates.map((update) => ({
    path: `updates/${update._meta.path}`,
    type: "update" as const,
    title: update.title,
    meta: update.summary,
  })),
  ...allWorks.map((work) => ({
    path: `works/${work._meta.path}`,
    type: "work" as const,
    title: work.title,
    meta: work.summary,
  })),
].map((data) => ({
  ...data,
  path: `${data.path}.webp`,
}));

export const Route = createFileRoute("/og/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const splat = params._splat;

        if (!splat) {
          throw notFound();
        }

        const allowedIndex = ALLOWED_OG_ROUTES.findIndex(
          (url) => url.path === splat,
        );

        if (allowedIndex < 0) {
          throw notFound();
        }

        const data = ALLOWED_OG_ROUTES[allowedIndex];

        const schema = z.object({
          title: z
            .string()
            .optional()
            .refine((val) => val || splat === "home.webp", {
              error: "Title required",
            }),
          category: z.string().or(z.array(z.string())).optional(),
          date: z.string().optional(),
          meta: z.string().optional(),
        });
        const validatedData = schema.safeParse(data);

        if (validatedData.error) {
          throw notFound();
        }

        const fonts = [
          "playfair-display/files/playfair-display-latin-wght-normal.woff2",
          "playfair-display/files/playfair-display-latin-wght-italic.woff2",
          "jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
          "inter/files/inter-latin-wght-normal.woff2",
        ].map((font) =>
          fs.readFileSync(
            path.join(
              process.cwd(),
              "node_modules",
              "@fontsource-variable",
              font,
            ),
          ),
        );

        return new ImageResponse(
          <OGTemplate
            title={validatedData.data.title}
            type={data.type}
            category={validatedData.data.category}
            date={validatedData.data.date}
            meta={validatedData.data.meta}
          />,
          {
            fonts,
            width: 1300,
            format: "webp",
            headers: {
              'Cache-Control': 'public, max-age=31536000, immutable'
            }
          },
        );
      },
    },
  },
});
