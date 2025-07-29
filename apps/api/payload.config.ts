import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { Account } from '@/collections/Account'
import { Content } from '@/collections/Content'
import { Session } from '@/collections/Session'
import { Tag } from '@/collections/Tag'
import { User } from '@/collections/User'
import { Verification } from '@/collections/Verification'

export default buildConfig({
  editor: lexicalEditor(),
  collections: [Content, Tag, User, Account, Session, Verification],
  secret: process.env.PAYLOAD_SECRET || '',
  db: postgresAdapter({
    idType: 'uuid',
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
    generateSchemaOutputFile: './src/generated/payload-schema.ts',
  }),
  sharp,
  auth: {
    jwtOrder: ['cookie', 'Bearer', 'JWT'],
  },
  serverURL: 'http://localhost:3000',
  cookiePrefix: 'api',
  email: resendAdapter({
    apiKey: process.env.RESEND_API_KEY || '',
    defaultFromName: 'Alfan Jauhari',
    defaultFromAddress: 'hi@alfanjauhari.com',
  }),
  typescript: {
    outputFile: './src/generated/payload-types.ts',
  },
})
