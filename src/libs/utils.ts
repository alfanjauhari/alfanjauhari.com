import { inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import clsx, { type ClassValue } from 'clsx'
import type { FieldHook } from 'payload'
import { twMerge } from 'tailwind-merge'
import type { auth } from '@/libs/auth'

export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(...classes))
}

export function debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(
  func: F,
  timeout: number,
): [(...args: Parameters<F>) => Promise<ReturnType<F>>, () => void] {
  let timer: ReturnType<typeof setTimeout>

  const debounceFunc = (...args: Parameters<F>): Promise<ReturnType<F>> => {
    return new Promise((resolve) => {
      if (timer) {
        clearTimeout(timer)
      }

      timer = setTimeout(() => {
        resolve(func(...args))
      }, timeout)
    })
  }

  const clearTimer = () => clearTimeout(timer)

  return [debounceFunc, clearTimer]
}

export function throttle<F extends (...args: Parameters<F>) => ReturnType<F>>(
  func: F,
  limit: number = 1000,
) {
  let lastRan: number
  let lastTimeout: NodeJS.Timeout

  return (...args: Parameters<F>): Promise<ReturnType<F>> => {
    return new Promise((resolve) => {
      if (lastRan && Date.now() - lastRan < limit) {
        clearTimeout(lastTimeout)

        lastTimeout = setTimeout(
          () => {
            lastRan = Date.now()
            resolve(func.apply(null, args))
          },
          limit - (Date.now() - lastRan),
        )
      } else {
        lastRan = Date.now()
        resolve(func.apply(null, args))
      }
    })
  }
}

export const formatSlug = (val: string): string =>
  val
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase()

export const formatSlugHook =
  (fallback: string): FieldHook =>
  ({ data, operation, value }) => {
    if (typeof value === 'string') {
      return formatSlug(value)
    }

    if (operation === 'create' || !data?.slug) {
      const fallbackData = data?.[fallback] || data?.[fallback]

      if (fallbackData && typeof fallbackData === 'string') {
        return formatSlug(fallbackData)
      }
    }

    return value
  }

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
})
