// content-collections.ts
import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";
var updates = defineCollection({
  name: "updates",
  directory: "src/contents/updates",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tag: z.string(),
    date: z.string().transform((date) => new Date(date))
  })
});
var pages = defineCollection({
  name: "pages",
  directory: "src/contents/pages",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string(),
    description: z.string()
  })
});
var snippets = defineCollection({
  name: "snippets",
  directory: "src/contents/snippets",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string().transform((date) => new Date(date))
  })
});
var content_collections_default = defineConfig({
  collections: [updates, pages, snippets]
});
export {
  content_collections_default as default
};
