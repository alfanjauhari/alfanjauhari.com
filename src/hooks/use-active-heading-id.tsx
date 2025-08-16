import { useEffect, useState } from 'react'
import { throttle } from '@/libs/utils'
import type { MarkdownHeading } from './use-page-headings'

export function useActiveHeadingId(headings: MarkdownHeading[]) {
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = throttle(() => {
      if (window.scrollY === 0) {
        return setActiveHeadingId(null)
      }

      const headingElements = headings
        .map((heading) => {
          const element = document.getElementById(heading.slug)
          if (!element) return null

          return { id: heading.slug, rect: element.getBoundingClientRect() }
        })
        .filter(
          (heading): heading is { id: string; rect: DOMRect } => !!heading,
        )

      const OFFSET = 32
      let firstHeading = headingElements.find(
        (heading) =>
          heading.rect.bottom > OFFSET && heading.rect.top < window.innerHeight,
      )

      if (!firstHeading) {
        const reversedBoxes = [...headingElements].reverse()

        firstHeading = reversedBoxes.find(({ rect }) => {
          return rect.bottom < OFFSET
        })
      }

      setActiveHeadingId((prevActiveHeadingId) => {
        if (!firstHeading) {
          return null
        }

        if (firstHeading.id !== prevActiveHeadingId) {
          return firstHeading.id
        }

        return prevActiveHeadingId
      })
    }, 100)

    handleScroll()

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [headings])

  return activeHeadingId
}
