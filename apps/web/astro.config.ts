import mdx from '@astrojs/mdx'
import partytown from '@astrojs/partytown'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel'
import sentry from '@sentry/astro'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import { copyButtonTransformer } from './shiki-transformers'

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4321

export default defineConfig({
  redirects: {
    '/x': 'https://x.com/alfanjauhari_',
    '/github': 'https://github.com/alfanjauhari',
    '/linkedin': 'https://linkedin.com/in/m-alfanjauhari',
    '/instagram': 'https://instagram.com/alfanjauhari_',
    '/fb': 'https://facebook.com/m.alfanjauhari',
  },
  integrations: [
    mdx(),
    react(),
    sentry({
      sourceMapsUploadOptions: {
        project: 'alfanjauhari-com-web',
        authToken: process.env.SENTRY_AUTH_TOKEN,
        enabled: false,
      },
      autoInstrumentation: {
        requestHandler: false,
      },
    }),
    partytown(),
  ],

  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
      transformers: [copyButtonTransformer()],
    },
  },

  adapter: vercel({
    includeFiles: [
      './src/content/updates/_components/web-development-with-progressive-enhancement/sandpack-files/App.tsx',

      './src/content/updates/_components/web-development-with-progressive-enhancement/sandpack-files/App.module.css',
    ],
  }),

  site: process.env.PUBLIC_SITE_URL || 'http://localhost:4321',
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
    ssr: {
      noExternal: ['zod'],
    },
  },
})
