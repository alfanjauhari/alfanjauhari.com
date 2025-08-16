import { allPages } from 'content-collections'
import SinglePageOGImage from './opengraph-image'

export async function generateStaticParams() {
  return allPages.map((page) => ({
    slug: page._meta.path,
  }))
}

export default SinglePageOGImage
