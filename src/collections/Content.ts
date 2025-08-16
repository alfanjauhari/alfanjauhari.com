import { lexicalHTMLField } from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'
import { formatSlugHook } from '@/libs/utils'

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
}
