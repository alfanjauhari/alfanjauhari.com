// @ts-check
import { defineConfig } from 'astro/config'

import mdx from '@astrojs/mdx'

import tailwind from '@astrojs/tailwind'

import react from '@astrojs/react'

import vercel from '@astrojs/vercel/serverless'
import path from 'path'

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), tailwind(), react()],

  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },

  output: 'hybrid',
  adapter: vercel({
    includeFiles: [
      './src/content/blog/_components/web-development-with-progressive-enhancement/sandpack-files/App.tsx',
      './src/content/blog/_components/web-development-with-progressive-enhancement/sandpack-files/App.module.css',
    ],
  }),
})
