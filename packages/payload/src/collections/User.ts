import type { CollectionConfig, FieldAccess } from 'payload'

const canWriteRole: FieldAccess = ({ req }) => {
  if (!req.user) return false

  if (req.user.role === 'admin') return true

  return false
}

export const User: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Name',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
      defaultValue: 'user',
      access: {
        create: canWriteRole,
        update: canWriteRole,
      },
    },
  ],
  access: {
    create: ({ req }) => {
      return req.user?.role === 'admin'
    },
    update: ({ req, id }) => {
      return req.user?.role === 'admin' ? true : req.user?.id === id
    },
    read: ({ req }) => {
      return req.user?.role === 'admin'
        ? true
        : {
            id: {
              equals: req.user?.id,
            },
          }
    },
  },
}
