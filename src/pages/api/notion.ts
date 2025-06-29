export const prerender = false

import { sql } from '@/libs/db'
import { APIError } from '@/libs/errors'
import { Client, APIResponseError as NotionAPIError } from '@notionhq/client'
import { NotionConverter } from 'notion-to-md'

export async function GET({ request }: { request: Request }) {
  const pageId = new URL(request.url).searchParams.get('pageId')

  try {
    if (!pageId) {
      throw new APIError('Missing pageId query parameter', {
        status: 404,
      })
    }

    const cached = await sql`SELECT cache_get(${pageId}) AS cached_value`

    if (cached.length && cached[0].cached_value) {
      return new Response(JSON.stringify({ body: cached[0].cached_value }), {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }

    const notion = new Client({
      auth: import.meta.env.NOTION_ACCESS_TOKEN,
    })

    const n2m = new NotionConverter(notion)
    const mdString = await n2m.convert(pageId)

    await sql`SELECT cache_set(${pageId}, ${mdString.content})`

    return new Response(JSON.stringify({ body: mdString.content }), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
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
