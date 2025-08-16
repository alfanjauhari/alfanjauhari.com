import { allSnippets } from 'content-collections'
import { notFound } from 'next/navigation'
import { buildMetadata } from '@/libs/metadata'

export interface SingleSnippetPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: SingleSnippetPageProps) {
  const { slug } = await params
  const snippet = allSnippets.find((snippet) => snippet._meta.path === slug)

  if (!snippet) {
    return notFound()
  }

  return buildMetadata({
    title: snippet.title,
    description: snippet.description,
    url: `/snippets/${slug}`,
  })
}

export async function generateStaticParams() {
  return allSnippets.map((snippet) => ({
    slug: snippet._meta.path,
  }))
}

export default async function SingleSnippetsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const snippet = allSnippets.find((s) => s._meta.path === slug)

  if (!snippet) {
    return notFound()
  }

  const { default: Content } = await import(`@/contents/snippets/${slug}.mdx`)

  return (
    <article>
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
        <h1 className="text-4xl font-heading tracking-wider text-stone-700 uppercase">
          {snippet.title}
        </h1>
        <p className="text-sm text-stone-500">
          {Intl.DateTimeFormat('en-ID', {
            dateStyle: 'medium',
          }).format(snippet.date)}
        </p>
      </div>
      <p className="italic">{snippet.description}</p>
      <hr className="border-stone-300 border-2 border-dashed my-6" />
      <div className="prose prose-stone max-w-none">
        <Content />
      </div>
    </article>
  )
}
