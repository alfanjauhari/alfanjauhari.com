import { allUpdates } from 'content-collections'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MainSingleLayout } from '@/components/ui/MainSingleLayout'
import { buildMetadata } from '@/libs/metadata'

export interface SingleUpdatesPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: SingleUpdatesPageProps): Promise<Metadata> {
  const { slug } = await params
  const update = allUpdates.find((update) => update._meta.path === slug)

  if (!update) {
    return {}
  }

  return buildMetadata({
    title: update.title,
    description: update.description,
    url: `/updates/${slug}`,
  })
}

export async function generateStaticParams() {
  return allUpdates.map((update) => ({
    slug: update._meta.path,
  }))
}

export default async function SingleUpdatesPage({
  params,
}: SingleUpdatesPageProps) {
  const { slug } = await params
  const update = allUpdates.find((update) => update._meta.path === slug)

  if (!update) {
    return notFound()
  }

  const { default: Content } = await import(`@/contents/updates/${slug}.mdx`)

  return (
    <MainSingleLayout
      title={update.title}
      description={update.description}
      tag={update.tag}
      date={update.date}
    >
      <Content />
    </MainSingleLayout>
  )
}
