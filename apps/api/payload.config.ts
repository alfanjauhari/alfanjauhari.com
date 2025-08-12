import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor, UploadFeature } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { Account } from '@/collections/Account'
import { Content } from '@/collections/Content'
import { Media } from '@/collections/Media'
import { Session } from '@/collections/Session'
import { Tag } from '@/collections/Tag'
import { User } from '@/collections/User'
import { Verification } from '@/collections/Verification'

export default buildConfig({
  editor: lexicalEditor({
    features: [
      UploadFeature({
        collections: {
          uploads: {
            fields: [],
          },
        },
      }),
    ],
  }),
  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: 'media',
        },
      },
      bucket: process.env.S3_BUCKET_NAME || '',
      clientUploads: true,
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION || 'auto',
      },
    }),
  ],
  collections: [Content, Tag, User, Account, Session, Verification, Media],
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
  serverURL: process.env.API_URL || 'http://localhost:3000',
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
