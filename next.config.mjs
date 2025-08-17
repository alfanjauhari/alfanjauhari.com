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
  redirects: async () => [
    {
      source: '/x',
      destination: 'https://x.com/alfanjauhari_',
      permanent: true,
    },
    {
      source: '/gh',
      destination: 'https://github.com/alfanjauhari',
      permanent: true,
    },
    {
      source: '/li',
      destination: 'https://linkedin.com/in/m-alfanjauhari',
      permanent: true,
    },
    {
      source: '/ig',
      destination: 'https://instagram.com/alfanjauhari_',
      permanent: true,
    },
    {
      source: '/fb',
      destination: 'https://facebook.com/m.alfanjauhari',
      permanent: true,
    },
    {
      source: '/admin/login',
      destination: '/login',
      permanent: true,
    },
    {
      source: '/admin/create-first-user',
      destination: '/register',
      permanent: true,
    },
  ],
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
