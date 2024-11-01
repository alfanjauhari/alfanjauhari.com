import { getCollection, getEntry } from 'astro:content'
import type { APIContext } from 'astro'
import { generateImage } from '../_generate-image'

export async function getStaticPaths() {
  return getCollection('blog').then((posts) =>
    posts.map((post) => ({
      params: {
        slug: post.slug,
      },
    })),
  )
}

type Slug = Awaited<ReturnType<typeof getStaticPaths>>[number]['params']['slug']

export async function GET({
  params,
  request,
}: APIContext<Record<string, string>, { slug: Slug }>) {
  const slug = params.slug

  const post = await getEntry('blog', slug)

  return generateImage(
    {
      title: post.data.title,
      description: post.data.description,
      date: post.data.date,
      tag: post.data.tag,
    },
    request,
  )
}
