import { getCollection, getEntry } from 'astro:content'
import type { APIContext } from 'astro'
import { generateImage } from '../_generate-image'

export async function getStaticPaths() {
  return getCollection('pages').then((posts) =>
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
}: APIContext<Record<string, string>, { slug: Slug }>) {
  const slug = params.slug

  const post = await getEntry('pages', slug)

  return generateImage({
    title: post.data.title,
    description: post.data.description,
  })
}
