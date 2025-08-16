import type { Update } from 'content-collections'
import { ArticleCard } from '@/components/ui/ArticleCard'
import { getPayload } from '@/libs/payload'

export interface RestrictedUpdatesProps {
  data?: Update[]
}

export async function RestrictedUpdates({ data }: RestrictedUpdatesProps) {
  const payload = await getPayload()
  const updates =
    data !== undefined
      ? data
      : await payload
          .find({
            collection: 'contents',
            select: {
              title: true,
              description: true,
              tag: true,
              updatedAt: true,
              slug: true,
            },
          })
          .then((res) =>
            res.docs.map((doc) => ({
              title: doc.title,
              description: doc.description,
              tag: typeof doc.tag === 'string' ? doc.tag : doc.tag.title,
              date: new Date(doc.updatedAt),
              _meta: {
                path: doc.slug,
              },
            })),
          )

  return updates.length > 0
    ? updates.map((post) => (
        <ArticleCard
          title={post.title}
          description={post.description}
          tag={post.tag}
          date={post.date}
          slug={post._meta.path}
          type="restricted"
          key={post._meta.path}
        />
      ))
    : null
}
