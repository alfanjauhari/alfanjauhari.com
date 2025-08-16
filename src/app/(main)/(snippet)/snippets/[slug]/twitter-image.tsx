import { allSnippets } from 'content-collections'
import SingleSnippetOGImage from './opengraph-image'

export async function generateStaticParams() {
  return allSnippets.map((snippet) => ({
    slug: snippet._meta.path,
  }))
}

export default SingleSnippetOGImage
