import type { CollectionConfig } from 'payload'

export const Account: CollectionConfig = {
  slug: 'accounts',
  indexes: [
    {
      fields: ['providerId', 'accountId'],
      unique: true,
    },
  ],
  access: {
    read: ({ req }) => {
      if (!req.user) return false

      if (req.user.role === 'admin') return true

      return {
        user: {
          equals: req.user.id,
        },
      }
    },
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    { name: 'accountId', type: 'text', required: true },
    { name: 'providerId', type: 'text', required: true },
    { name: 'accessToken', type: 'text' },
    { name: 'refreshToken', type: 'text' },
    { name: 'accessTokenExpiresAt', type: 'date' },
    { name: 'refreshTokenExpiresAt', type: 'date' },
    { name: 'scope', type: 'text' },
    { name: 'idToken', type: 'text' },
    { name: 'password', type: 'text' },
  ],
  admin: {
    hidden: true,
  },
}
