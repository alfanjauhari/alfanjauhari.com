import * as payloadSchema from '@payload-schema'
import { drizzle } from '@payloadcms/db-postgres/drizzle/node-postgres'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import { openAPI } from 'better-auth/plugins'
import { Pool } from 'pg'

export const auth = betterAuth({
  database: drizzleAdapter(
    drizzle(
      new Pool({
        connectionString: process.env.DATABASE_URL,
      }),
    ),
    {
      provider: 'pg',
      schema: {
        account: payloadSchema.accounts,
        session: payloadSchema.sessions,
        user: payloadSchema.users,
        verification: payloadSchema.verifications,
      },
    },
  ),
  advanced: {
    database: {
      generateId: false,
    },
    cookiePrefix: 'alfanjauhari.com',
  },
  emailAndPassword: {
    enabled: true,
  },
  account: {
    fields: {
      userId: 'user',
    },
  },
  session: {
    fields: {
      userId: 'user',
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'user',
        required: false,
        input: false,
      },
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
  },
  plugins: [openAPI(), nextCookies()],
  trustedOrigins: ['http://localhost:4321', 'https://alfanjauhari.com'],
})
