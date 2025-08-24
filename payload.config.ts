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
import { env } from '@/libs/env'

export default buildConfig({
  editor: lexicalEditor({
    features: ({ defaultFeatures, rootFeatures }) => [
      ...defaultFeatures,
      ...rootFeatures,
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
      bucket: env.S3_BUCKET_NAME,
      clientUploads: true,
      config: {
        credentials: {
          accessKeyId: env.S3_ACCESS_KEY,
          secretAccessKey: env.S3_SECRET_ACCESS_KEY,
        },
        endpoint: env.S3_ENDPOINT,
        region: env.S3_REGION,
      },
    }),
  ],
  collections: [Content, Tag, User, Account, Session, Verification, Media],
  secret: env.PAYLOAD_SECRET,
  db: postgresAdapter({
    idType: 'uuid',
    pool: {
      connectionString: env.DATABASE_URL,
    },
    generateSchemaOutputFile: './src/generated/payload-schema.ts',
  }),
  sharp,
  auth: {
    jwtOrder: ['cookie', 'Bearer', 'JWT'],
  },
  cookiePrefix: 'api',
  email: resendAdapter({
    apiKey: env.RESEND_API_KEY,
    defaultFromName: 'Alfan Jauhari',
    defaultFromAddress: 'noreply@mail.alfanjauhari.com',
  }),
  typescript: {
    outputFile: './src/generated/payload-types.ts',
  },
})
