import { getPayload } from '@/libs/payload'

export async function GET() {
  const payload = await getPayload()

  const contents = await payload.find({
    collection: 'contents',
    select: {
      title: true,
      slug: true,
      description: true,
      tag: true,
      updatedAt: true,
    },
    pagination: false,
  })

  return Response.json({
    message: 'Successfuly retrieved public contents',
    ...contents,
  })
}
