import { getCollection, getEntry } from 'astro:content'
import { ImageResponse } from '@vercel/og'
import type { APIContext } from 'astro'
import {
  SnippetOGImage,
  type SnippetOGImageProps,
} from '@/components/ui/SnippetOGImage'

export async function getStaticPaths() {
  const snippets = await getCollection('snippets')

  return snippets.map((snippet) => ({
    params: { slug: snippet.id },
    props: { slug: snippet.id },
  }))
}

const FONTS = [
  'Anton400-Vercel-OG.ttf',
  'Satoshi-Regular-Vercel-OG.ttf',
  'Satoshi-Italic-Vercel-OG.ttf',
]

async function generateImage(props: SnippetOGImageProps) {
  const fonts = await Promise.all(
    FONTS.map((font) =>
      fetch(new URL(`/fonts/${font}`, import.meta.env.PUBLIC_CDN_URL)).then(
        (res) => res.arrayBuffer(),
      ),
    ),
  )

  return new ImageResponse(SnippetOGImage(props), {
    fonts: [
      {
        data: fonts[0],
        name: 'Anton',
        style: 'normal',
      },
      {
        data: fonts[1],
        name: 'Satoshi',
        style: 'normal',
      },
      {
        data: fonts[2],
        name: 'Satoshi',
        style: 'italic',
      },
    ],
  })
}

export async function GET({
  params,
}: APIContext<Record<string, string>, { slug: string }>) {
  const slug = params.slug

  const snippet = await getEntry('snippets', slug)

  if (!snippet) {
    return new Response('Not Found', { status: 404 })
  }

  return generateImage({
    title: snippet.data.title,
    description: snippet.data.description,
    date: snippet.data.createdAt,
  })
}
