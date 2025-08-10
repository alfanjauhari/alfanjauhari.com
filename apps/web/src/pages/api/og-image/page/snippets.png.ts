import { generateImage } from '../_generate-image'

export async function GET() {
  return generateImage({
    title: 'Snippets',
    description: 'A collection of my greatest code I ever written',
  })
}
