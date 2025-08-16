import { allPages } from 'content-collections'
import { notFound } from 'next/navigation'
import { OGImage } from '@/components/ui/OGImage'
import { generateOGImage } from '@/libs/metadata'
import type { SinglePageProps } from './page'

export async function generateStaticParams() {
  return allPages.map((page) => ({
    slug: page._meta.path,
  }))
}

export default async function SinglePageOGImage({ params }: SinglePageProps) {
  const { slug } = await params
  const page = allPages.find((page) => page._meta.path === slug)

  if (!page) {
    return notFound()
  }

  return generateOGImage(
    OGImage({
      title: page.title,
      description: page.description,
    }),
  )
}
