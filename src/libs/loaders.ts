import { z } from 'astro:schema'
import { sql } from '@/libs/db'
import type { Loader } from 'astro/loaders'

export const RestrictedContentResultSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  body: z.string(),
  published_at: z.date().nullable(),
})

export type RestrictedContentResult = z.infer<
  typeof RestrictedContentResultSchema
>

export function restrictedContentLoader(): Loader {
  return {
    name: 'restricted-content',
    load: async ({ store, parseData, renderMarkdown }) => {
      try {
        const data = await sql<RestrictedContentResult[]>`
          SELECT
            contents.*,
            ARRAY_AGG(tags.name) AS tags
          FROM
            contents
            LEFT OUTER JOIN contents_tags ON contents_tags.content_id = contents.id
            LEFT OUTER JOIN tags ON contents_tags.tag_id = tags.id
          WHERE
            contents.published_at <= NOW ()
          GROUP BY
            contents.id
          ORDER BY
            contents.published_at DESC;
        `

        store.clear()

        for (const item of data) {
          const data = await parseData({
            id: item.slug,
            data: item,
          })

          const rendered = await renderMarkdown(item.body)

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
