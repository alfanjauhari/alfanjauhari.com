import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'
import Pre from './components/mdx/pre'

const components = {
  pre: Pre,
  Image,
} satisfies MDXComponents

export function useMDXComponents(): MDXComponents {
  return components
}
