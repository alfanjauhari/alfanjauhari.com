import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { MainSingleLayout } from '@/components/ui/MainSingleLayout'
import { TableOfContents } from '@/components/ui/TableOfContents'
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
  const update = await payload
    .find({
      collection: 'contents',
      where: {
        slug: {
          equals: slug,
        },
        _status: {
          equals: 'published',
        },
      },
      limit: 1,
    })
    .then((res) => res.docs[0])

  if (!update) {
    return notFound()
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return redirect(
      `/login?redirectTo=${encodeURIComponent(`/updates/r/${slug}`)}&message=${encodeURIComponent(`You must be logged in to access "${update.title}" content!`)}`,
    )
  }

  return (
    <MainSingleLayout
      title={update.title}
      description={update.description}
      tag={
        update.tag && typeof update.tag === 'object' && 'title' in update.tag
          ? update.tag.title
          : update.tag
      }
      date={new Date(update.updatedAt)}
      toc={
        <TableOfContents containerSelector="#single-content-wrapper article" />
      }
    >
      {update.html ? (
        <div
          // biome-ignore lint/security/noDangerouslySetInnerHtml: We need to set the html content
          dangerouslySetInnerHTML={{
            __html: update.html,
          }}
        ></div>
      ) : null}
    </MainSingleLayout>
  )
}
