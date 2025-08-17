import { OGImage } from '@/components/ui/OGImage'
import { generateOGImage } from '@/libs/metadata'
import type { UpdatesTagPageProps } from './page'

export { generateStaticParams } from './page'

export default async function UpdatesOGImage({ params }: UpdatesTagPageProps) {
  const { slug } = await params

  return generateOGImage(
    OGImage({
      title: `Updates Tagged by ${slug}`,
      description: `Latest updates and news tagged by ${slug}`,
    }),
  )
}
