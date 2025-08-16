import * as payloadSchema from '@payload-schema'
import { drizzle } from '@payloadcms/db-postgres/drizzle/node-postgres'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import { openAPI } from 'better-auth/plugins'
import { Pool } from 'pg'
import { getPayload } from './payload'

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
    crossSubDomainCookies: {
      enabled: process.env.NODE_ENV === 'production',
      domain: 'alfanjauhari.com',
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ url, user }) => {
      const payload = await getPayload()

      await payload.sendEmail({
        to: user.email,
        subject: 'Verify your email',
        text: `Hey ${user.name}. Thank you for signing up on my website. Click this link to verify your email: ${url}. Enjoy!`,
      })
    },
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
  trustedOrigins: ['http://localhost:4321', 'https://*.alfanjauhari.com'],
})
