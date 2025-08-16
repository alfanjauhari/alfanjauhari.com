import { useEffect, useState } from 'react'

export interface MarkdownHeading {
  slug: string
  depth: number
  text: string
}

export function usePageHeadings(containerSelector?: string) {
  const [headings, setHeadings] = useState<MarkdownHeading[]>([])

  useEffect(() => {
    const container = document.querySelector(
      containerSelector || '.article-content',
    )
    if (!container) return

    const newHeadings = Array.from(
      container.querySelectorAll('h2, h3, h4, h5'),
    ).map((heading) => ({
      slug: heading.id,
      depth: parseInt(heading.tagName.replace('H', ''), 10),
      text: heading.textContent || '',
    }))

    setHeadings(newHeadings)
  }, [containerSelector])

  return headings
}
