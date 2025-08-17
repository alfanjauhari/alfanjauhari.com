import { allUpdates } from 'content-collections'
import { ArticleCard } from '@/components/ui/ArticleCard'
import { RestrictedUpdates } from '@/components/ui/RestrictedUpdates'
import { RevealHeading } from '@/components/ui/RevealHeading'
import { buildMetadata } from '@/libs/metadata'
import { getPayload } from '@/libs/payload'

// Revalidate every 7 days
export const revalidate = 604800

export interface UpdatesTagPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const payload = await getPayload()
  const restrictedUpdateTags = await payload
    .find({
      collection: 'contents',
      where: {
        'tag.title': {
          not_equals: null,
        },
        _status: {
          equals: 'published',
        },
      },
      select: {
        tag: true,
      },
    })
    .then((res) =>
      res.docs.map((doc) =>
        typeof doc.tag === 'object' && 'title' in doc.tag
          ? doc.tag.title
          : doc.tag,
      ),
    )

  const updateTags = allUpdates.map((update) => update.tag)

  const tags = [...new Set(restrictedUpdateTags), ...new Set(updateTags)]

  return tags.map((tag) => ({
    slug: tag,
  }))
}

export async function generateMetadata({ params }: UpdatesTagPageProps) {
  const { slug } = await params

  return buildMetadata({
    title: `Updates Tagged by ${slug}`,
    description: `Latest updates and news tagged by ${slug}`,
    url: `/updates/tag/${slug}`,
  })
}

export default async function UpdatesPage({ params }: UpdatesTagPageProps) {
  const { slug } = await params

  return (
    <div className="flex flex-col gap-12 py-20">
      <RevealHeading className="text-6xl lg:text-10xl text-stone-700">
        Latest Updates Tagged {slug}
      </RevealHeading>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {allUpdates
          .filter((update) => update.tag === slug)
          .map((update) => (
            <ArticleCard
              title={update.title}
              description={update.description}
              tag={update.tag}
              date={update.date}
              slug={update._meta.path}
              key={update._meta.path}
            />
          ))}

        <RestrictedUpdates
          filter={{
            'tag.title': {
              equals: slug,
            },
          }}
        />
      </div>
    </div>
  )
}
