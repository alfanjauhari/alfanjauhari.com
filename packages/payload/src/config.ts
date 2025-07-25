import { Content } from '@alfanjauhari-com/payload/collections/Content'
import { Tag } from '@alfanjauhari-com/payload/collections/Tag'
import { User } from '@alfanjauhari-com/payload/collections/User'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

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
