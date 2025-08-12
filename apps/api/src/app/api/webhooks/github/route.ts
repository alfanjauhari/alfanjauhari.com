import crypto from 'node:crypto'
import type { PushEvent } from '@octokit/webhooks-types'
import { headers as nextHeaders } from 'next/headers'
import type { NextRequest } from 'next/server'

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || ''

function verifySignature(payload: string, signature256: string | null) {
  if (!signature256 || !WEBHOOK_SECRET) return false

  const data = `sha256=${crypto.createHmac('sha256', WEBHOOK_SECRET).update(payload).digest('hex')}`

  const signatureBuffer = Buffer.from(signature256)
  const verificationBuffer = Buffer.from(data)

  return crypto.timingSafeEqual(signatureBuffer, verificationBuffer)
}

// biome-ignore lint/suspicious/noExplicitAny: Need to change the body type
function isMasterPush(body: any): body is PushEvent {
  if ('ref' in body && 'before' in body && 'after' in body) {
    return body.ref === 'refs/heads/main'
  }

  return false
}

export async function POST(request: NextRequest) {
  try {
    const headers = await nextHeaders()
    const body = await request.json()

    const signature = headers.get('x-hub-signature-256')

    if (!verifySignature(JSON.stringify(body), signature)) {
      return new Response('Unauthorized', { status: 401 })
    }

    if (!isMasterPush(body)) return

    const contentAdded = body.commits
      .flatMap((commit) => commit.added)
      .filter(
        (file) =>
          file.includes('content/blog/') || file.includes('content/snippets/'),
      )

    if (contentAdded.length > 0) {
      // TODO: ADD NEWSLETTER
      console.log('Content added:', contentAdded)
    }

    return Response.json(
      { message: 'Webhook received successfully' },
      { status: 200 },
    )
  } catch (error) {
    return new Response(String(error), { status: 500 })
  }
}
