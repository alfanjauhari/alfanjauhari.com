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
  auth: {
    loginWithUsername: {
      allowEmailLogin: true,
      requireEmail: false,
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Name',
      required: true,
    },
    {
      name: 'username',
      type: 'text',
      unique: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
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
