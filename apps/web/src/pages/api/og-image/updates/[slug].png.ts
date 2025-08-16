import { getCollection, getEntry } from 'astro:content'
import type { APIContext } from 'astro'
import { generateImage } from '../_generate-image'

export async function getStaticPaths() {
  const restrictedUpdates = getCollection('restricted')
  const generalUpdates = getCollection('updates')
  const updates = await Promise.all([restrictedUpdates, generalUpdates]).then(
    (res) => res.flat(),
  )

  return updates.map((update) => ({
    params: { slug: update.id },
    props: { slug: update.id, collection: update.collection },
  }))
}

export async function GET({
  params,
  props,
}: APIContext<{ collection: 'updates' | 'restricted' }, { slug: string }>) {
  const slug = params.slug

  const update = await getEntry(props.collection, slug)

  if (!update) {
    return new Response('Not Found', { status: 404 })
  }

  return generateImage({
    title: update.data.title,
    description: update.data.description,
    date:
      update.collection === 'restricted'
        ? update.data.updatedAt
        : update.data.date,
    tag: update.data.tag,
  })
}
