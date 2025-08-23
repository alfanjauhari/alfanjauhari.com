'use client'

import { CodeIcon } from 'lucide-react'
import { useCallback, useRef } from 'react'

export function MobileSnippetButtonToggle() {
  const onClick = () => {
    const snippetLayout = document.querySelector(
      '.group\\/snippet-layout',
    ) as HTMLElement | null
    if (!snippetLayout) return

    console.log(snippetLayout, 'LAYOUT')

    const isOpen = snippetLayout.dataset.sidebarOpen === 'true'
    snippetLayout.dataset.sidebarOpen = isOpen ? 'false' : 'true'

    document.body.classList.toggle('overflow-hidden')

    if (document.body.dataset.lenisPrevent !== undefined) {
      delete document.body.dataset.lenisPrevent
    } else {
      document.body.dataset.lenisPrevent = ''
    }
  }

  return (
    <button
      className="underline cursor-pointer"
      type="button"
      onClick={onClick}
    >
      Click here
    </button>
  )
}

export function SnippetButtonToggle() {
  const lastScrollY = useRef(0)
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null)

  const buttonRefCallback = useCallback((node: HTMLButtonElement | null) => {
    if (!node) return

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      node.style.transform = 'translateY(1000%)'

      lastScrollY.current = currentScrollY

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }

      scrollTimeout.current = setTimeout(() => {
        node.style.transform = 'translateY(0)'
      }, 200)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }
    }
  }, [])

  const onClick = () => {
    const snippetLayout = document.querySelector(
      '.group\\/snippet-layout',
    ) as HTMLElement | null
    if (!snippetLayout) return

    const isOpen = snippetLayout.dataset.sidebarOpen === 'true'
    snippetLayout.dataset.sidebarOpen = isOpen ? 'false' : 'true'

    document.body.classList.toggle('overflow-hidden')

    if (document.body.dataset.lenisPrevent !== undefined) {
      delete document.body.dataset.lenisPrevent
    } else {
      document.body.dataset.lenisPrevent = ''
    }
  }

  return (
    <button
      className="fixed bottom-6 left-6 rounded-full bg-stone-300 size-12 flex items-center justify-center cursor-pointer duration-300 z-50 md:hidden"
      type="button"
      ref={buttonRefCallback}
      onClick={onClick}
    >
      <CodeIcon />
    </button>
  )
}
