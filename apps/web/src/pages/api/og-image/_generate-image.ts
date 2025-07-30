import { ImageResponse } from '@vercel/og'
import { OGImage, type OGImageProps } from '@/components/ui/OGImage'

const FONTS = [
  'Anton400-Vercel-OG.ttf',
  'Satoshi-Regular-Vercel-OG.ttf',
  'Satoshi-Italic-Vercel-OG.ttf',
]

export async function generateImage(props: OGImageProps) {
  const fonts = await Promise.all(
    FONTS.map((font) =>
      fetch(new URL(`/fonts/${font}`, import.meta.env.PUBLIC_CDN_URL)).then(
        (res) => res.arrayBuffer(),
      ),
    ),
  )

  return new ImageResponse(OGImage(props), {
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
