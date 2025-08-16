'use client'

import type { MarkdownHeading } from 'astro'
import { useActiveHeadingId } from '@/hooks/use-active-heading-id'
import { cn } from '@/libs/utils'

export interface TableOfContentsProps {
  headings: MarkdownHeading[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
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
            className="group/item"
            style={{
              paddingLeft: `calc(1rem * ${Math.max(0, heading.depth - 2)})`,
            }}
            data-active={activeHeadingId === heading.slug}
            key={heading.slug}
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
