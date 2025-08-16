import clsx, { type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(...classes))
}

export function parseCookies(cookieString: string): [string, string] {
  const [name, value] = cookieString.split('=')

  return [name, decodeURIComponent(value)]
}

export function safeParseJSON<T>(
  jsonString: string,
  fallbackDefault?: boolean,
): T | string | null {
  try {
    return JSON.parse(jsonString) as T
  } catch (_error) {
    return fallbackDefault ? jsonString : null
  }
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
