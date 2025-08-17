import { getPayload } from '@/libs/payload'
import RestrictedUpdateOGImage from './opengraph-image'

export async function generateStaticParams() {
  const payload = await getPayload()
  const contents = await payload.find({
    collection: 'contents',
    select: {
      slug: true,
    },
  })

  return contents.docs.map((content) => ({
    slug: content.slug,
  }))
}

export default RestrictedUpdateOGImage
