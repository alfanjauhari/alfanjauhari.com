import type { Loader } from 'astro/loaders'
import { z } from 'astro/zod'

export const RestrictedContentResultSchema = z.object({
  id: z.string(),
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

type PayloadContent = Omit<RestrictedContentResult, 'tag'> & {
  tag: { title: string } | string
}

export function restrictedContentLoader(): Loader {
  return {
    name: 'restricted-content',
    load: async ({ store, parseData, renderMarkdown }) => {
      try {
        const contents = await fetch(
          `${import.meta.env.PUBLIC_PAYLOAD_API_URL}/api/contents?populate[tag][title]=true`,
        ).then((res) => res.json() as Promise<{ docs: PayloadContent[] }>)

        store.clear()

        for (const item of contents.docs) {
          const data = await parseData({
            id: item.slug,
            data: {
              ...item,
              tag:
                typeof item.tag !== 'string' && 'title' in item.tag
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
