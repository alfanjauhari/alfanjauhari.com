export const prerender = false

import { sql } from '@/libs/db'
import { APIError } from '@/libs/errors'
import {
  Client,
  LogLevel,
  APIResponseError as NotionAPIError,
} from '@notionhq/client'
import { S3Client } from 'bun'
import { extension } from 'mime-types'
import { NotionConverter } from 'notion-to-md'

const s3 = new S3Client({
  endpoint: import.meta.env.R2_ENDPOINT,
  accessKeyId: import.meta.env.R2_ACCESS_KEY_ID,
  secretAccessKey: import.meta.env.R2_SECRET_ACCESS_KEY,
  bucket: import.meta.env.R2_BUCKET_NAME,
  region: 'auto',
})

const cacheDuration = 60 * 60 * 1000 // 1 hour in milliseconds

export async function GET({ request }: { request: Request }) {
  const pageId = new URL(request.url).searchParams.get('pageId')
  const lastUpdated = new URL(request.url).searchParams.get('lastUpdated')

  try {
    if (!pageId) {
      throw new APIError('Missing pageId query parameter', {
        status: 404,
      })
    }

    const cached = await sql<
      { expired: Date; result: string }[]
    >`SELECT * FROM cache_get(${pageId})`

    if (cached.length && cached[0].result) {
      const expiredTime = cached[0].expired.getTime()
      const lastUpdatedTime = lastUpdated
        ? new Date(lastUpdated).getTime() + cacheDuration
        : 0

      // Check if the cache is still valid based on the last updated time difference with the cache expiration time
      const refreshCache = lastUpdatedTime > expiredTime

      if (!refreshCache) {
        return new Response(
          JSON.stringify({ id: pageId, body: cached[0].result }),
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Cache': 'HIT',
            },
          },
        )
      }
    }

    const notion = new Client({
      auth: import.meta.env.NOTION_ACCESS_TOKEN,
      logLevel: LogLevel.ERROR,
    })

    const n2m = new NotionConverter(notion).uploadMediaUsing({
      uploadHandler: async (url, blockId) => {
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Failed to fetch media from ${url}`)
        }

        const buffer = await response.arrayBuffer()
        const contentType = response.headers.get('Content-Type')
        const extensionName = contentType ? extension(contentType) : '.bin'

        const fileName = `${blockId}.${extensionName}`

        const s3File = s3.file(fileName, {
          type: contentType ?? undefined,
        })

        await s3File.write(buffer)

        return `${import.meta.env.R2_PUBLIC_URL}/${fileName}`
      },
      failForward: false,
      cleanupHandler: async (entry) => {
        if (!entry.mediaInfo.uploadedUrl) {
          return console.warn('No uploaded URL found for media entry:', entry)
        }

        const url = new URL(entry.mediaInfo.uploadedUrl)
        const key = url.pathname.substring(1)

        const s3File = s3.file(key)

        await s3File.delete()
      },
    })

    const mdString = await n2m.convert(pageId)

    await sql`SELECT cache_set(${pageId}, ${mdString.content})`

    return new Response(
      JSON.stringify({ body: mdString.content, id: pageId }),
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Cache': 'MISS',
        },
      },
    )
  } catch (error) {
    if (error instanceof NotionAPIError) {
      return new Response(
        JSON.stringify({
          name: 'NotionAPIError',
          message: error.message,
        }),
        {
          status: error.status,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    if (error instanceof APIError) {
      return new Response(JSON.stringify(error.toJSON()), {
        status: error.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(
      JSON.stringify({
        error: 'Failed to generate Notion markdown',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }
}
