import { notFound } from 'next/navigation'
import { OGImage } from '@/components/ui/OGImage'
import { generateOGImage } from '@/libs/metadata'
import { getPayload } from '@/libs/payload'
import type { RestrictedUpdatePageProps } from './page'

export async function generateStaticParams() {
  const payload = await getPayload()
  const contents = await payload.find({
    collection: 'contents',
    select: {
      slug: true,
    },
  })

  return contents.docs.map((content) => ({
    slug: content.slug,
  }))
}

export default async function RestrictedUpdateOGImage({
  params,
}: RestrictedUpdatePageProps) {
  const { slug } = await params
  const payload = await getPayload()
  const contents = await payload.find({
    collection: 'contents',
    select: {
      title: true,
      description: true,
      updatedAt: true,
      tag: true,
      slug: true,
    },
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  const update = contents.docs[0]

  if (!update) {
    return notFound()
  }

  return generateOGImage(
    OGImage({
      title: update.title,
      description: update.description,
      date: new Date(update.updatedAt),
      tag:
        update.tag && typeof update.tag === 'object' && 'title' in update.tag
          ? update.tag.title
          : update.tag,
    }),
  )
}
