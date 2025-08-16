import { allPages } from 'content-collections'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MainSingleLayout } from '@/components/ui/MainSingleLayout'
import { buildMetadata } from '@/libs/metadata'

export interface SinglePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: SinglePageProps): Promise<Metadata> {
  const { slug } = await params
  const page = allPages.find((page) => page._meta.path === slug)

  if (!page) {
    return notFound()
  }

  return buildMetadata({
    title: page.title,
    description: page.description,
    url: `/${slug}`,
  })
}

export async function generateStaticParams() {
  return allPages.map((page) => ({
    slug: page._meta.path,
  }))
}

export default async function SinglePage({ params }: SinglePageProps) {
  const { slug } = await params
  const page = allPages.find((page) => page._meta.path === slug)

  if (!page) {
    return notFound()
  }

  const { default: Content } = await import(`@/contents/pages/${slug}.mdx`)

  return (
    <MainSingleLayout title={page.title} description={page.description}>
      <Content />
    </MainSingleLayout>
  )
}
