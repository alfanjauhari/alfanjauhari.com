import { SnippetOGImage as SnippetOGImageElement } from '@/components/ui/SnippetOGImage'
import { generateOGImage } from '@/libs/metadata'

export default function SnippetsOGImage() {
  return generateOGImage(
    SnippetOGImageElement({
      title: 'Snippets',
      description: 'A collection of my greatest code I ever written',
    }),
  )
}
