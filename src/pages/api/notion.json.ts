import { APIResponseError, Client } from '@notionhq/client'
import { sql } from 'bun'
import { NotionConverter } from 'notion-to-md'

export async function GET({ request }: { request: Request }) {
  const pageId = new URL(request.url).searchParams.get('pageId')

  if (!pageId) {
    return new Response('Page ID is required', { status: 400 })
  }

  try {
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
    if (error instanceof APIResponseError) {
      return new Response(`Notion API Error: ${error.message}`, {
        status: error.status,
      })
    }

    console.error('Error generating Notion markdown:', error)

    return new Response('Failed to generate notion markdown', { status: 500 })
  }
}
