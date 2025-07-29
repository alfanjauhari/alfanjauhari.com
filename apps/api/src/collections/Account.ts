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
    create: () => false,
    update: () => false,
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
    { name: 'accessToken', type: 'text', hidden: true },
    { name: 'refreshToken', type: 'text', hidden: true },
    { name: 'accessTokenExpiresAt', type: 'date', hidden: true },
    { name: 'refreshTokenExpiresAt', type: 'date', hidden: true },
    { name: 'scope', type: 'text', hidden: true },
    { name: 'idToken', type: 'text', hidden: true },
    { name: 'password', type: 'text', hidden: true },
  ],
  admin: {
    hidden: true,
  },
}
