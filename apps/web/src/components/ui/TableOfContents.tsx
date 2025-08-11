import type { MarkdownHeading } from 'astro'

export interface TableOfContentsProps {
  headings: MarkdownHeading[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  return (
    <aside className="toc sticky top-12 self-start">
      <h2 className="font-bold mb-4 uppercase">Table of Contents</h2>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li
            key={heading.slug}
            className="group/item"
            style={{
              paddingLeft: `calc(1rem * ${Math.max(0, heading.depth - 2)})`,
            }}
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
