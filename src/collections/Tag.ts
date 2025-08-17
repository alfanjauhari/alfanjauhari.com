import type { CollectionConfig } from 'payload'

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
      unique: true,
    },
  ],
}
