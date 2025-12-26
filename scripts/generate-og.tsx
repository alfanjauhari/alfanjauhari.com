import fs from "node:fs/promises";
import path from "node:path";
import { Renderer } from "@takumi-rs/core";
import { fromJsx } from "@takumi-rs/helpers/jsx";
import {
  allRestrictedUpdates,
  allSnippets,
  allUpdates,
  allWorks,
} from "content-collections";
import z from "zod";
import OGTemplate from "@/components/og-template";

console.info("GENERATING OG IMAGES");

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
    path: "uses",
    type: "page" as const,
    title: "Uses",
    meta: "A living collection of the hardware, software, and office gear I use on a daily basis to build a software.",
  },
  {
    path: "updates",
    type: "page" as const,
    title: "Updates",
    meta: "A collection of my thoughts on software engineering, design systems, and the intersection of humanity and technology.",
  },
  {
    path: "auth/register",
    type: "page" as const,
    title: "Register",
    meta: "Create an account to unlock personalized features and enjoy a better experience on my platform.",
  },
  {
    path: "auth/login",
    type: "page" as const,
    title: "Login",
    meta: "Log in to your account to access personalized features and continue your experience seamlessly.",
  },
  ...allUpdates.map((update) => ({
    path: `updates/${update._meta.path}`,
    type: "update" as const,
    title: update.title,
    meta: update.summary,
  })),
  ...allRestrictedUpdates.map((update) => ({
    path: `updates/r/${update._meta.path}`,
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
  ...allSnippets.map((snippet) => ({
    path: `snippets/${snippet._meta.path}`,
    type: "snippet" as const,
    title: snippet.title,
    meta: snippet.summary,
  })),
].map((data) => ({
  ...data,
  path: `${data.path}.webp`,
}));

async function writeFile(pathProp: string, data: Buffer) {
  const dirPath = pathProp.split("/").filter((p) => !p.includes(".webp"));

  if (dirPath.length > 0) {
    await fs.mkdir(path.join(...dirPath), { recursive: true });
  }

  await fs.writeFile(pathProp, data);
}

let count: number = 0;

for (const data of ALLOWED_OG_ROUTES) {
  const schema = z.object({
    title: z
      .string()
      .optional()
      .refine((val) => val || data.path === "home.webp", {
        error: "Title required",
      }),
    category: z.string().or(z.array(z.string())).optional(),
    date: z.string().optional(),
    meta: z.string().optional(),
  });
  const validatedData = schema.safeParse(data);

  if (validatedData.error) {
    throw new Error("Error");
  }

  const fonts = await Promise.all(
    [
      "https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono:vf@latest/latin-wght-normal.woff2",
      "https://cdn.jsdelivr.net/fontsource/fonts/inter:vf@latest/latin-wght-normal.woff2",
      "https://cdn.jsdelivr.net/fontsource/fonts/playfair-display:vf@latest/latin-wght-normal.woff2",
      "https://cdn.jsdelivr.net/fontsource/fonts/playfair-display:vf@latest/latin-wght-italic.woff2",
    ].map((url) => fetch(url).then((res) => res.arrayBuffer())),
  );

  const renderer = new Renderer({
    fonts,
  });

  const node = await fromJsx(
    <OGTemplate
      title={validatedData.data.title}
      type={data.type}
      category={validatedData.data.category}
      date={validatedData.data.date}
      meta={validatedData.data.meta}
    />,
  );

  const png = await renderer.render(node, {
    width: 1300,
    format: "webp",
  });

  await writeFile(path.join("public/images/og", data.path), png);

  count++;
}

console.log(
  `SUCCESSFULLY GENERATED ${count} OG IMAGES FROM TOTAL ${ALLOWED_OG_ROUTES.length} ENTRIES`,
);
