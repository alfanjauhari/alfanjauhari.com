import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'
import { restrictedContentLoader } from './libs/loaders'

const updatesCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/updates' }),
  schema: z.object({
    title: z.string(),
    tag: z.string(),
    date: z.date({ coerce: true }),
    description: z.string(),
  }),
})

const pageCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
})

const snippetCollection = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.{md,mdx}',
    base: './src/content/snippets',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    createdAt: z.date({ coerce: true }),
  }),
})

const restrictedCollection = defineCollection({
  loader: restrictedContentLoader(),
})

export const collections = {
  updates: updatesCollection,
  pages: pageCollection,
  snippets: snippetCollection,
  restricted: restrictedCollection,
}
