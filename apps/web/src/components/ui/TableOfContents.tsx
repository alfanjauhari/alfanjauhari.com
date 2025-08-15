'use client'

import dynamic from 'next/dynamic'
import { useActiveHeadingId } from '@/hooks/use-active-heading-id'
import { usePageHeadings } from '@/hooks/use-page-headings'
import { cn } from '@/libs/utils'

export default function TableOfContentsComponent({
  containerSelector = '.group\\/single-layout',
}) {
  const headings = usePageHeadings(containerSelector)
  const activeHeadingId = useActiveHeadingId(headings)

  return (
    <aside id="toc" className="sticky top-12 self-start hidden lg:block">
      <h2 className="font-bold mb-4 uppercase">Table of Contents</h2>
      <ul className="space-y-2">
        <li className="group/item">
          <a
            // biome-ignore lint/a11y/useValidAnchor: We dont need the href link for intro
            href="#"
            className={cn('text-sm decoration-dashed', {
              underline: !activeHeadingId,
            })}
          >
            Introduction
          </a>
        </li>
        {headings.map((heading) => (
          <li
            key={heading.slug}
            className="group/item"
            style={{
              paddingLeft: `calc(1rem * ${Math.max(0, heading.depth - 2)})`,
            }}
            data-active={activeHeadingId === heading.slug}
          >
            <a
              href={`#${heading.slug}`}
              className="text-sm group-[[data-active=true]]/item:underline decoration-dashed"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export const TableOfContents = dynamic(
  () => import('@/components/ui/TableOfContents'),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-2 sticky top-12 self-start hidden lg:block">
        <div className="h-8 bg-gray-200 w-full animate-pulse rounded-md" />
        <div className="h-6 bg-gray-200 w-4/5 animate-pulse rounded-md" />
        <div className="h-6 bg-gray-200 w-1/2 animate-pulse rounded-md ml-4" />
        <div className="h-6 bg-gray-200 w-3/4 animate-pulse rounded-md ml-4" />
        <div className="h-6 bg-gray-200 w-1/2 animate-pulse rounded-md ml-4" />
        <div className="h-6 bg-gray-200 w-4/5 animate-pulse rounded-md" />
        <div className="h-6 bg-gray-200 w-4/5 animate-pulse rounded-md" />
      </div>
    ),
  },
)
