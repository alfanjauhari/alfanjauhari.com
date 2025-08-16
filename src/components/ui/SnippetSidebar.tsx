'use client'

import type { Snippet } from 'content-collections'
import { usePathname } from 'next/navigation'
import { memo, useCallback, useDeferredValue, useState } from 'react'
import { cn } from '@/libs/utils'
import { buttonClassName, buttonClassNameInverted } from '../base/Button'
import { Input } from '../base/Input'

export interface SnippetSidebarProps {
  snippets: Snippet[]
}

const SnippetSidebarList = memo(
  function SnippetSidebarList({ snippets: snippetsProp }: SnippetSidebarProps) {
    const currentPath = usePathname()

    const [snippets, setSnippets] = useState<Snippet[]>(
      snippetsProp.slice(0, 20),
    )

    const listRefCallback = useCallback(
      (node: HTMLUListElement | null) => {
        if (!node) return
        const loadingElement = node.querySelector('[data-loading]')

        if (!loadingElement) return

        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setSnippets((prevSnippets) => {
                const nextSnippets = snippetsProp.slice(
                  prevSnippets.length,
                  prevSnippets.length + 20,
                )

                if (nextSnippets.length === 0) {
                  observer.unobserve(loadingElement)

                  return prevSnippets
                }

                return [...prevSnippets, ...nextSnippets]
              })
            }
          })
        })

        observer.observe(loadingElement)
      },
      [snippetsProp],
    )

    return (
      <ul className="space-y-2" ref={listRefCallback}>
        {snippets.map((snippet) => (
          <li key={snippet._meta.path}>
            <a
              href={`/snippets/${snippet._meta.path}`}
              className={cn(
                buttonClassName,
                'relative w-full flex justify-center p-4',
                buttonClassNameInverted,
                'aria-[current=page]:bg-stone-700 aria-[current=page]:text-white',
              )}
              aria-current={
                currentPath === `/snippets/${snippet._meta.path}`
                  ? 'page'
                  : undefined
              }
            >
              <span className="z-10">{snippet.title}</span>
            </a>
          </li>
        ))}
        {snippets.length < snippetsProp.length && (
          <li data-loading>
            <span>Loading more snippets...</span>
          </li>
        )}
      </ul>
    )
  },
  (prevProps, nextProps) => {
    return prevProps.snippets.length === nextProps.snippets.length
  },
)

export function SnippetSidebar({ snippets }: SnippetSidebarProps) {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  const filteredSnippets = snippets.filter((snippet) => {
    return (
      snippet.title.toLowerCase().includes(deferredQuery.toLowerCase()) ||
      snippet.description.toLowerCase().includes(deferredQuery.toLowerCase())
    )
  })

  return (
    <aside
      id="snippet-sidebar"
      className="sticky top-6 overflow-y-auto h-auto max-h-[calc(100vh-1.5rem*2)] space-y-4 max-md:group-[[data-sidebar-open=true]]/snippet-layout:fixed duration-200 max-md:group-[[data-sidebar-open=true]]/snippet-layout:bg-gray-100 max-md:group-[[data-sidebar-open=true]]/snippet-layout:inset-y-0 max-md:group-[[data-sidebar-open=true]]/snippet-layout:inset-x-6 max-md:group-[[data-sidebar-open=true]]/snippet-layout:top-40 max-md:group-[[data-sidebar-open=true]]/snippet-layout:max-h-full"
      data-lenis-prevent
    >
      <Input
        className="bg-white"
        placeholder="Search snippets..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <SnippetSidebarList
        snippets={filteredSnippets}
        key={filteredSnippets.length}
      />
    </aside>
  )
}
