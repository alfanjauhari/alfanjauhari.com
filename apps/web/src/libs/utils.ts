import clsx, { type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(...classes))
}

export function parseCookies(cookieString: string): [string, string] {
  const [name, value] = cookieString.split('=')

  return [name, decodeURIComponent(value)]
}
