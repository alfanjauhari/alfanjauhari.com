import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { auth } from '@/libs/auth'
import { getPayload } from '@/libs/payload'

export interface RestrictedUpdatePageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function RestrictedUpdatePage({
  params,
}: RestrictedUpdatePageProps) {
  const { slug } = await params

  const payload = await getPayload()
  const data = await payload
    .find({
      collection: 'contents',
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
    })
    .then((res) => res.docs[0])

  if (!data) {
    return notFound()
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return redirect(
      `/login?redirectTo=${encodeURIComponent(`/updates/r/${slug}`)}&message=${encodeURIComponent(`You must be logged in to access "${data.title}" content!`)}`,
    )
  }

  return (
    <div>
      <h1>Restricted Update Page</h1>
      <p>You are logged in as {session.user.email}</p>
    </div>
  )
}
