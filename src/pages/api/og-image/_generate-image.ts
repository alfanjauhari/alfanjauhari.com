import { OGImage, type OGImageProps } from '@/components/ui/OGImage'
import { ImageResponse } from '@vercel/og'
import type { APIContext } from 'astro'

export async function generateImage(
  props: OGImageProps,
  request: APIContext['request'],
) {
  // #region Font Data
  const antonFontData = await fetch(
    new URL('/fonts/Anton400-Vercel-OG.ttf', request.url),
  ).then((res) => res.arrayBuffer())
  const satoshiFontData = await fetch(
    new URL('/fonts/Satoshi-Regular-Vercel-OG.ttf', request.url),
  ).then((res) => res.arrayBuffer())
  const satoshiItalicFontData = await fetch(
    new URL('/fonts/Satoshi-Italic-Vercel-OG.ttf', request.url),
  ).then((res) => res.arrayBuffer())
  // #endregion

  return new ImageResponse(OGImage(props), {
    fonts: [
      {
        data: antonFontData,
        name: 'Anton',
        style: 'normal',
      },
      {
        data: satoshiFontData,
        name: 'Satoshi',
        style: 'normal',
      },
      {
        data: satoshiItalicFontData,
        name: 'Satoshi',
        style: 'italic',
      },
    ],
  })
}
