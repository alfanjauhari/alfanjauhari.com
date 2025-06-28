import path from 'path'
import { GlobalOGImage } from '@/components/ui/GlobalOGImage'
import { ImageResponse } from '@vercel/og'
import { pathToFileURL } from 'bun'

const FONTS = [
  'Anton400-Vercel-OG.ttf',
  'Satoshi-Regular-Vercel-OG.ttf',
  'Satoshi-Italic-Vercel-OG.ttf',
]

export async function GET() {
  const basePath = path.join(process.cwd(), 'src', 'assets', 'fonts')
  const fonts = await Promise.all(
    FONTS.map((font) =>
      fetch(pathToFileURL(path.join(basePath, font))).then((res) =>
        res.arrayBuffer(),
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
