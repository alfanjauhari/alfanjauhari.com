import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'
import { restrictedContentLoader } from './libs/loaders'

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
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

const restrictedCollection = defineCollection({
  loader: restrictedContentLoader(),
})

export const collections = {
  blog: blogCollection,
  pages: pageCollection,
  restricted: restrictedCollection,
}
