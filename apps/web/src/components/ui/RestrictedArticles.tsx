import type { Update } from 'content-collections'
import { ArticleCard } from '@/components/ui/ArticleCard'

export function RestrictedArticles({ articles }: { articles: Update[] }) {
  return articles.map((post) => (
    <ArticleCard
      title={post.title}
      description={post.description}
      tag={post.tag}
      date={post.date}
      slug={post._meta.path}
      type="restricted"
      key={post._meta.path}
    />
  ))
}
