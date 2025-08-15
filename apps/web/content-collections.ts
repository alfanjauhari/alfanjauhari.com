import { defineCollection, defineConfig } from '@content-collections/core'
import { z } from 'zod'

const updates = defineCollection({
  name: 'updates',
  directory: 'src/contents/updates',
  include: '**/*.mdx',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tag: z.string(),
    date: z.string().transform((date) => new Date(date)),
  }),
})

const pages = defineCollection({
  name: 'pages',
  directory: 'src/contents/pages',
  include: '**/*.mdx',
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
})

const snippets = defineCollection({
  name: 'snippets',
  directory: 'src/contents/snippets',
  include: '**/*.mdx',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string().transform((date) => new Date(date)),
  }),
})

export default defineConfig({
  collections: [updates, pages, snippets],
})
