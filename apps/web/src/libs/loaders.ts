import { z } from 'astro:schema'
import config from '@alfanjauhari-com/payload/config'
import type { Loader } from 'astro/loaders'
import { getPayload } from 'payload'
import type { Content } from 'payload-types'

export const RestrictedContentResultSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  markdown: z.string(),
  updatedAt: z.coerce.date().nullable(),
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
        })

        store.clear()

        for (const item of contents.docs) {
          const data = await parseData<Omit<Content, 'content'>>({
            id: item.slug,
            data: item,
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
