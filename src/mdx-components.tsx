import type { MDXComponents } from 'mdx/types'
import Pre from './components/mdx/pre'

const components = {
  pre: Pre,
} satisfies MDXComponents

export function useMDXComponents(): MDXComponents {
  return components
}
