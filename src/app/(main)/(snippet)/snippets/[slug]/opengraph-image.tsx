import { allSnippets } from 'content-collections'
import { notFound } from 'next/navigation'
import { SnippetOGImage } from '@/components/ui/SnippetOGImage'
import { generateOGImage } from '@/libs/metadata'
import type { SingleSnippetPageProps } from './page'

export async function generateStaticParams() {
  return allSnippets.map((snippet) => ({
    slug: snippet._meta.path,
  }))
}

export default async function SingleSnippetOGImage({
  params,
}: SingleSnippetPageProps) {
  const { slug } = await params
  const snippet = allSnippets.find((snippet) => snippet._meta.path === slug)

  if (!snippet) {
    return notFound()
  }

  return generateOGImage(
    SnippetOGImage({
      title: snippet.title,
      description: snippet.description,
      date: snippet.date,
    }),
  )
}
