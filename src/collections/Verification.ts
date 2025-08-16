import type { CollectionConfig } from 'payload'

export const Verification: CollectionConfig = {
  slug: 'verifications',
  fields: [
    {
      name: 'identifier',
      type: 'text',
      required: true,
    },
    {
      name: 'value',
      type: 'text',
      required: true,
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
    },
  ],
  admin: {
    hidden: true,
  },
}
