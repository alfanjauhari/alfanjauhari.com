import { z } from 'astro:schema'
import config from '@alfanjauhari-com/payload/config'
import type { Loader } from 'astro/loaders'
import { getPayload } from 'payload'

export const RestrictedContentResultSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  markdown: z.string(),
  tag: z.string(),
  updatedAt: z.coerce.date(),
})

export type RestrictedContentResult = z.infer<
  typeof RestrictedContentResultSchema
>

export function restrictedContentLoader(): Loader {
  return {
    name: 'restricted-content',
    load: async ({ store, parseData, renderMarkdown }) => {
      try {
        const p = await getPayload({ config })

        const contents = await p.find({
          collection: 'contents',
          populate: {
            tags: {
              title: true,
            },
          },
        })

        store.clear()

        for (const item of contents.docs) {
          const data = await parseData({
            id: item.slug,
            data: {
              ...item,
              tag:
                typeof item.tag !== 'number' && 'title' in item.tag
                  ? item.tag.title
                  : '',
            },
          })

          const body = item.markdown || ''
          const rendered = await renderMarkdown(body)

          store.set({
            id: item.slug,
            data,
            rendered,
          })
        }
      } catch (error) {
        throw new Error(`Failed to load restricted content: ${error}`)
      }
    },
    schema: RestrictedContentResultSchema,
  }
}
