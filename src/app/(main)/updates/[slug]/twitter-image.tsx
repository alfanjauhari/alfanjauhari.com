import { allUpdates } from 'content-collections'
import SingleUpdatesOGImage from './opengraph-image'

export async function generateStaticParams() {
  return allUpdates.map((update) => ({
    slug: update._meta.path,
  }))
}

export default SingleUpdatesOGImage
