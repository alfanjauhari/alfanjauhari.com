import { defineCollection, z } from 'astro:content'

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    tag: z.string(),
    date: z.date({ coerce: true }),
    description: z.string(),
  }),
})

export const collections = {
  blog: blogCollection,
}
