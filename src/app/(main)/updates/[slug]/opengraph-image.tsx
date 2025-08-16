import { allUpdates } from 'content-collections'
import { notFound } from 'next/navigation'
import { OGImage } from '@/components/ui/OGImage'
import { generateOGImage } from '@/libs/metadata'
import type { SingleUpdatesPageProps } from './page'

export async function generateStaticParams() {
  return allUpdates.map((update) => ({
    slug: update._meta.path,
  }))
}

export default async function SingleUpdatesOGImage({
  params,
}: SingleUpdatesPageProps) {
  const { slug } = await params
  const update = allUpdates.find((update) => update._meta.path === slug)

  if (!update) {
    return notFound()
  }

  return generateOGImage(
    OGImage({
      title: update.title,
      description: update.description,
      date: update.date,
      tag: update.tag,
    }),
  )
}
