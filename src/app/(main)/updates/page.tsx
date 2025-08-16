import { allUpdates } from 'content-collections'
import type { Metadata } from 'next'
import { ArticleCard } from '@/components/ui/ArticleCard'
import { RevealHeading } from '@/components/ui/RevealHeading'
import { buildMetadata } from '@/libs/metadata'

export const metadata: Metadata = buildMetadata({
  title: 'Updates',
  description: 'Latest updates and news',
  url: '/updates',
})

export default function UpdatesPage() {
  return (
    <div className="flex flex-col gap-12 py-20">
      <RevealHeading className="text-6xl lg:text-10xl text-stone-700">
        Latest Updates
      </RevealHeading>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {allUpdates.map((update) => (
          <ArticleCard
            title={update.title}
            description={update.description}
            tag={update.tag}
            date={update.date}
            slug={update._meta.path}
            key={update._meta.path}
          />
        ))}
      </div>
    </div>
  )
}
