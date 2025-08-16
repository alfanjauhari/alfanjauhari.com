import { LockIcon } from 'lucide-react'

export interface ArticleCardProps {
  slug: string
  tag: string
  title: string
  date: Date
  description: string
  type?: 'updates' | 'restricted'
}

export function ArticleCard({ type = 'updates', ...post }: ArticleCardProps) {
  return (
    <a
      href={
        type === 'updates' ? `/updates/${post.slug}` : `/updates/r/${post.slug}`
      }
      className="p-6 border border-stone-300 relative after:bg-white after:absolute after:inset-0 after:-translate-y-full after:duration-300 hover:after:translate-y-0 overflow-y-hidden group/article bg-stone-700"
    >
      <div className="space-y-2 relative z-10">
        <div className="flex items-center justify-between">
          <p className="text-white text-sm group-hover/article:text-stone-700 duration-300">
            {post.tag} &mdash;{' '}
            {Intl.DateTimeFormat('en-ID', {
              dateStyle: 'medium',
            }).format(post.date)}
          </p>
          {type === 'restricted' && (
            <LockIcon className="size-4 text-white group-hover/article:text-stone-700 duration-300" />
          )}
        </div>
        <h1 className="text-white text-4xl font-heading uppercase my-2 group-hover/article:text-stone-700 duration-300">
          {post.title}
        </h1>
        <p className="text-white text-balance group-hover/article:text-stone-700 duration-300">
          {post.description}
        </p>
      </div>
    </a>
  )
}
