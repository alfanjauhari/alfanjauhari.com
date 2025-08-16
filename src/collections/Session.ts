import type { CollectionConfig } from 'payload'

export const Session: CollectionConfig = {
  slug: 'sessions',
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'token',
      type: 'text',
      required: true,
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
    },
    {
      name: 'ipAddress',
      type: 'text',
      required: true,
    },
    {
      name: 'userAgent',
      type: 'text',
      required: true,
    },
  ],
  admin: {
    hidden: true,
  },
}
