import { OGImage, type OGImageProps } from '@/components/ui/OGImage'
import { ImageResponse } from '@vercel/og'
import path from 'path'

const FONTS = [
  'Anton400-Vercel-OG.ttf',
  'Satoshi-Regular-Vercel-OG.ttf',
  'Satoshi-Italic-Vercel-OG.ttf',
]

export async function generateImage(props: OGImageProps) {
  const basePath = path.join(process.cwd(), 'src', 'assets', 'fonts')
  const fonts = await Promise.all(
    FONTS.map((font) =>
      fetch(new URL(path.join(basePath, font), import.meta.url)).then((res) =>
        res.arrayBuffer(),
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
