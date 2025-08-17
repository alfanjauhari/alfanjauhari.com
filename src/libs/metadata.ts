import type { Metadata } from 'next'
import { ImageResponse } from 'next/og'
import type { ReactElement } from 'react'
import { env } from './env'

export async function generateOGImage<
  TFont extends { name: string; url: string; style: 'normal' | 'italic' },
>(element: ReactElement, fontsParam: TFont[] = []) {
  const DEFAULT_FONTS = [
    {
      name: 'Anton',
      url: 'Anton400-Vercel-OG.ttf',
      style: 'normal',
    },
    {
      name: 'Satoshi',
      url: 'Satoshi-Regular-Vercel-OG.ttf',
      style: 'normal',
    },
    {
      name: 'Satoshi',
      url: 'Satoshi-Italic-Vercel-OG.ttf',
      style: 'italic',
    },
  ] as const

  const fontsData = [...fontsParam, ...DEFAULT_FONTS]

  const fonts = await Promise.all(
    fontsData.map(async (font) => ({
      name: font.name,
      style: font.style,
      data: await fetch(
        new URL(`/fonts/${font.url}`, env.NEXT_PUBLIC_CDN_URL),
      ).then((res) => res.arrayBuffer()),
    })),
  )

  return new ImageResponse(element, {
    fonts,
  })
}

export interface BuildMetadataParams {
  title: string
  description: string
  url: string
}

export function buildMetadata({
  title,
  description,
  url,
}: BuildMetadataParams): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  }
}
