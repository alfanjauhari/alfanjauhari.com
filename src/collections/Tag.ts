import type { CollectionConfig } from 'payload'
import { formatSlugHook } from '@/libs/utils'

export const Tag: CollectionConfig = {
  slug: 'tags',
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
  ],
}
