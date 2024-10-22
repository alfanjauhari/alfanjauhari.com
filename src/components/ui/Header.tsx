'use client'

import { NAVIGATION_MENU } from '@/libs/config'
import { cn } from '@/libs/utils'
import {
  type ComponentProps,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'

export interface HeaderProps extends ComponentProps<'header'> {
  pathname: string
}

export const Header = forwardRef<HTMLElement, HeaderProps>(
  ({ className, pathname, ...props }, ref) => {
    const innerRef = useRef<HTMLElement>(null)

    useImperativeHandle(ref, () => innerRef.current!)

    useEffect(() => {
      let prevScroll = window.scrollY

      const onScroll = () => {
        const currentScroll = window.scrollY

        if (currentScroll <= prevScroll) {
          innerRef.current?.classList.remove('-translate-y-full')
          innerRef.current?.classList.add('translate-y-0')
        } else {
          innerRef.current?.classList.remove('translate-y-0')
          innerRef.current?.classList.add('-translate-y-full')
        }

        if (currentScroll === 0) {
          innerRef.current?.classList.remove('bg-white')
        } else {
          innerRef.current?.classList.add('bg-white')
        }

        prevScroll = currentScroll
      }

      window.addEventListener('scroll', onScroll)

      return () => {
        window.removeEventListener('scroll', onScroll)
      }
    }, [])

    return (
      <header
        className={cn(
          'sticky top-0 z-50 w-full px-6 h-20 flex justify-between items-center mx-auto duration-200',
          className,
        )}
        ref={innerRef}
        {...props}
      >
        <a
          href="/"
          className="flex items-center gap-3 z-20 relative font-heading text-4xl text-stone-700"
        >
          A.
        </a>
        <nav>
          <ul className="flex items-center justify-center gap-4">
            {NAVIGATION_MENU.map((menu) => (
              <li key={menu.href}>
                <a
                  href={menu.href}
                  aria-current={pathname === menu.href ? 'page' : undefined}
                  className="text-sm aria-[current]:underline aria-[current]:decoration-dotted text-stone-700"
                >
                  {menu.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    )
  },
)

Header.displayName = 'Layout__Header'
