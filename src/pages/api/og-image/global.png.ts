import { GlobalOGImage } from '@/components/ui/GlobalOGImage'
import { ImageResponse } from '@vercel/og'
import type { APIContext } from 'astro'

export async function GET({ request }: APIContext) {
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

  return new ImageResponse(GlobalOGImage(), {
    fonts: [
      {
        data: antonFontData,
        name: 'Anton',
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
