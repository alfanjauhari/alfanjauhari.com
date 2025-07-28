import {
  convertLexicalToMarkdown,
  editorConfigFactory,
} from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { CollectionConfig, RichTextField } from 'payload'
import { formatSlugHook } from '@/libs/formatter'

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
    {
      name: 'markdown',
      type: 'textarea',
      admin: {
        hidden: true,
      },
      hooks: {
        afterRead: [
          ({ siblingData, siblingFields }) => {
            const data: SerializedEditorState = siblingData.content

            if (!data) {
              return ''
            }

            const markdown = convertLexicalToMarkdown({
              data,
              editorConfig: editorConfigFactory.fromField({
                field: siblingFields.find(
                  (field) => 'name' in field && field.name === 'content',
                ) as RichTextField,
              }),
            })

            return markdown
          },
        ],
        beforeChange: [
          ({ siblingData }) => {
            // Ensure that the markdown field is not saved in the database
            delete siblingData.markdown
            return null
          },
        ],
      },
    },
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
      if (!req.user) {
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
