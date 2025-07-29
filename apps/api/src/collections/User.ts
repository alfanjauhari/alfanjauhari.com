import type { CollectionConfig, FieldAccess } from 'payload'
import { auth } from '@/libs/auth'

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
    disableLocalStrategy: true,
    strategies: [
      {
        name: 'better-auth',
        authenticate: async ({ headers, payload }) => {
          const data = await auth.api.getSession({
            headers,
            asResponse: false,
          })

          if (!data) {
            return {
              user: null,
            }
          }

          const user = await payload.findByID({
            collection: 'users',
            id: data.user.id,
            depth: 0,
          })

          return {
            user: {
              ...user,
              collection: 'users',
            },
          }
        },
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Name',
      required: true,
    },
    {
      name: 'email',
      type: 'text',
      label: 'Email',
      required: true,
      unique: true,
    },
    {
      name: 'emailVerified',
      type: 'checkbox',
      hidden: true,
    },
    {
      name: 'image',
      type: 'text',
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
    {
      name: 'accounts',
      type: 'join',
      collection: 'accounts',
      on: 'user',
      admin: {
        defaultColumns: ['id', 'type', 'provider'],
        allowCreate: false,
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
    admin: ({ req }) => {
      if (!req.user) return false

      if (req.user.role === 'admin') return true

      return false
    },
  },
}
