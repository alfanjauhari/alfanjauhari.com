import { allSnippets } from 'content-collections'
import type { PropsWithChildren } from 'react'
import { SnippetButtonToggle } from '@/components/ui/SnippetButtonToggle'
import { SnippetSidebar } from '@/components/ui/SnippetSidebar'

export default function SnippetsLayout({ children }: PropsWithChildren) {
  return (
    <div className="group/snippet-layout grid grid-cols-[0_100%] md:grid-cols-[190px_1fr] lg:grid-cols-[320px_1fr] py-20 md:gap-8">
      <SnippetSidebar snippets={allSnippets} />

      <SnippetButtonToggle />

      {children}
    </div>
  )
}
