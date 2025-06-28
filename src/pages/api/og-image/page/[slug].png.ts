import { getCollection, getEntry } from 'astro:content'
import type { APIContext } from 'astro'
import { generateImage } from '../_generate-image'

export async function getStaticPaths() {
  const posts = await getCollection('pages')

  return posts.map((post) => ({
    params: { slug: post.id },
    props: { slug: post.id },
  }))
}

export async function GET({
  params,
}: APIContext<Record<string, string>, { slug: string }>) {
  const slug = params.slug

  const post = await getEntry('pages', slug)

  if (!post) {
    return new Response('Not Found', { status: 404 })
  }

  return generateImage({
    title: post.data.title,
    description: post.data.description,
  })
}
