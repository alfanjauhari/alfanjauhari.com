import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { Tag } from '@/collections/Tag'
import { User } from '@/collections/User'
import { Content } from './src/collections/Content'

export default buildConfig({
  editor: lexicalEditor(),
  collections: [Content, Tag, User],
  secret: process.env.PAYLOAD_SECRET || '',
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  sharp,
})
