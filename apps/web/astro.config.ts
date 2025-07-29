import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

console.log('ENV', import.meta.env.PUBLIC_PAYLOAD_API_URL, process.env.SITE_URL)
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

  site: process.env.SITE_URL || 'http://localhost:4321',
  output: 'static',
  server: {
    allowedHosts: process.env.NODE_ENV === 'development' ? true : undefined,
    port: PORT,
  },

  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        '/payload/api': {
          target: process.env.PUBLIC_PAYLOAD_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace('/payload', ''),
        },
        '/custom': {
          target: process.env.PUBLIC_PAYLOAD_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace('/custom', ''),
        },
      },
    },
  },
})
