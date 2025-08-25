import { lexicalHTMLField } from '@payloadcms/richtext-lexical'
import { revalidatePath } from 'next/cache'
import type { CollectionConfig } from 'payload'
import { formatSlugHook } from '@/libs/utils'

const HOSTS = ['alfanjauhari.com', 'www.alfanjauhari.com']
const PREFIXES = ['', '/updates', '/updates/tag']

// This function used to revalidate the paths that contains a updates contents. Also, while revalidating
// we need to purging the cloudflare cache so the user doesn't see a stale cache
const revalidateContentPaths = async () => {
  revalidatePath('/')
  revalidatePath('/updates')
  revalidatePath('/updates/tag/[slug]', 'page')

  if (process.env.CF_DNS_API_TOKEN !== '' && process.env.CF_ZONE_ID !== '') {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${process.env.CF_ZONE_ID}/purge_cache`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.CF_DNS_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prefixes: HOSTS.flatMap((host) =>
            PREFIXES.map((prefix) => host + prefix),
          ),
        }),
      },
    )

    if (!response.ok) {
      console.error(
        'Error while purging cloudflare cache. No problem!!! \n Error detail:',
        response.statusText,
      )
    } else {
      console.info('Successfully purging cloudflare cache')
    }
  }

  console.info('CACHE PURGED AND REVALIDATED!')
}

export const Content: CollectionConfig = {
  slug: 'contents',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      index: true,
      hooks: {
        beforeValidate: [formatSlugHook('title')],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Content',
      required: true,
    },
    lexicalHTMLField({
      htmlFieldName: 'html',
      lexicalFieldName: 'content',
      hidden: true,
      storeInDB: false,
    }),
    {
      name: 'tag',
      type: 'relationship',
      label: 'Tag',
      relationTo: 'tags',
      hasMany: false,
      required: true,
    },
  ],
  access: {
    read: ({ req }) => {
      if (!req.user) return false

      if (req.user.role !== 'admin') {
        return {
          _status: {
            equals: 'published',
          },
        }
      }

      return true
    },
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [revalidateContentPaths],
    afterDelete: [revalidateContentPaths],
  },
}
