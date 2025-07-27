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
