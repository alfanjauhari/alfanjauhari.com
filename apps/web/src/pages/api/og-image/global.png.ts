import { ImageResponse } from '@vercel/og'
import { GlobalOGImage } from '@/components/ui/GlobalOGImage'

const FONTS = [
  'Anton400-Vercel-OG.ttf',
  'Satoshi-Regular-Vercel-OG.ttf',
  'Satoshi-Italic-Vercel-OG.ttf',
]

export async function GET() {
  const fonts = await Promise.all(
    FONTS.map((font) =>
      fetch(new URL(`/fonts/${font}`, import.meta.env.PUBLIC_CDN_URL)).then(
        (res) => res.arrayBuffer(),
      ),
    ),
  )

  return new ImageResponse(GlobalOGImage(), {
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
