import type { Where } from 'payload'
import { ArticleCard } from '@/components/ui/ArticleCard'
import { getPayload } from '@/libs/payload'

export interface RestrictedUpdatesProps {
  filter?: Where
}

export async function RestrictedUpdates({ filter }: RestrictedUpdatesProps) {
  const payload = await getPayload()
  const updates = await payload
    .find({
      collection: 'contents',
      where: {
        _status: {
          equals: 'published',
        },
        ...(filter ? { ...filter } : {}),
      },
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
        tag:
          doc.tag && typeof doc.tag === 'object' && 'title' in doc.tag
            ? doc.tag.title
            : doc.tag,
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
