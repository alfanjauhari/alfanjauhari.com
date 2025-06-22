import { defineConfig } from 'astro/config'

import mdx from '@astrojs/mdx'
import node from '@astrojs/node'
import react from '@astrojs/react'

import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  integrations: [mdx(), react()],

  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },

  adapter: node({
    mode: 'standalone',
  }),

  output: 'server',
  site: process.env.BASE_URL || 'http://localhost:4321',

  server: {
    allowedHosts: process.env.NODE_ENV === 'development' ? true : undefined,
  },

  vite: {
    plugins: [tailwindcss()],
  },
})
