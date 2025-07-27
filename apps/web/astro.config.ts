import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4321

export default defineConfig({
  integrations: [mdx(), react()],

  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },

  adapter: vercel({
    includeFiles: [
      './src/content/blog/_components/web-development-with-progressive-enhancement/sandpack-files/App.tsx',

      './src/content/blog/_components/web-development-with-progressive-enhancement/sandpack-files/App.module.css',
    ],
  }),

  output: 'static',
  site: process.env.BASE_URL || 'http://localhost:4321',

  server: {
    allowedHosts: process.env.NODE_ENV === 'development' ? true : undefined,
    port: PORT,
  },

  vite: {
    plugins: [tailwindcss()],
  },
})
