import { Context, defineCollection, defineConfig, Document } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { z } from "zod";
import rehypeShiki from '@shikijs/rehype'

async function MDXTransformer<TSchema extends Document & {content: string}>(document: TSchema, context: Context<TSchema>) {
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
}

const UpdateSchema = z.object({
  title: z.string(),
  tag: z.string(),
  summary: z.string(),
  date: z.coerce.date(),
  content: z.string()
})

const updates = defineCollection({
  name: "updates",
  directory: "content/updates",
  include: "*.mdx",
  schema: UpdateSchema,
  transform: MDXTransformer
});

const restrictedUpdates = defineCollection({
  name: "restrictedUpdates",
  directory: "content/privates/updates",
  include: "*.mdx",
  schema: UpdateSchema,
  transform: MDXTransformer,
});

const works = defineCollection({
  name: 'works',
  directory: 'content/works',
  include: '*.mdx',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    client: z.string(),
    role: z.string(),
    year: z.number(),
    techstack: z.array(z.string()),
    link: z.url().optional(),
    challenge: z.string(),
    solution: z.string(),
    thumbnail: z.string(),
    content: z.string()
  }),
  transform: MDXTransformer
})

const snippets = defineCollection({
  name: 'snippets',
  directory: 'content/snippets',
  include: '*.mdx',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    language: z.string(),
    tags: z.array(z.string()),
    content: z.string()
  }),
  transform: MDXTransformer
})

export default defineConfig({
  collections: [updates, restrictedUpdates, works, snippets],
});
