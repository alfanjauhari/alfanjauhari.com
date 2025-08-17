import { OGImage } from '@/components/ui/OGImage'
import { generateOGImage } from '@/libs/metadata'

export default function UpdatesOGImage() {
  return generateOGImage(
    OGImage({
      title: 'Updates',
      description:
        'Latest articles, thoughts and random stuffs mixed in one place',
    }),
  )
}
