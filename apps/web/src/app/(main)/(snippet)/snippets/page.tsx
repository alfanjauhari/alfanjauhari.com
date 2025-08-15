import type { Metadata } from 'next'
import { MobileSnippetButtonToggle } from '@/components/ui/SnippetButtonToggle'
import { buildMetadata } from '@/libs/metadata'

export const metadata: Metadata = buildMetadata({
  title: 'Snippets',
  description: 'A collection of my greatest code I ever written',
  url: '/snippets',
})

export default function SnippetsPage() {
  return (
    <div className="prose prose-stone max-w-none">
      <h1 className="text-4xl font-heading tracking-wider text-stone-700">
        NOTHING TO SEE HERE
      </h1>
      <p className="hidden md:block">
        Use the snippet list on the left to explore the content.
      </p>
      <div className="block md:hidden">
        <MobileSnippetButtonToggle /> or clik the button at the bottom to
        explore the snippets content.
      </div>
    </div>
  )
}
