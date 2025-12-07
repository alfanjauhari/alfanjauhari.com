import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { z } from "zod";
import rehypeShiki from '@shikijs/rehype'

const updates = defineCollection({
  name: "updates",
  directory: "content/updates",
  include: "*.mdx",
  schema: z.object({
    title: z.string(),
    tag: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    isMemberOnly: z.literal(false).default(false),
    content: z.string()
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, {
      rehypePlugins: [[rehypeShiki, {
        themes: {
          light: 'catppuccin-latte',
          dark: 'catppuccin-mocha'
        },
        inline: 'tailing-curly-colon',
      }]]
    });
    return {
      ...document,
      mdx,
    };
  },
});

export default defineConfig({
  collections: [updates],
});
