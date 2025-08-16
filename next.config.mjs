import { withContentCollections } from '@content-collections/next'
import createMDX from '@next/mdx'
import { withPayload } from '@payloadcms/next/withPayload'
import { withSentryConfig } from '@sentry/nextjs'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['tsx', 'mdx', 'ts'],
  output: 'standalone',
  experimental: {
    ppr: true,
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: 'github-light',
          wrap: true,
        },
      ],
      rehypeSlug,
    ],
  },
})

export default withContentCollections(
  withSentryConfig(withMDX(withPayload(nextConfig)), {
    org: 'alfan-jauhari',
    project: 'alfanjauhari-com',
    silent: !process.env.CI,
    widenClientFileUpload: true,
    disableLogger: true,
    automaticVercelMonitors: true,
    telemetry: false,
  }),
)
