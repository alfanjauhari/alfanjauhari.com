import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel'
import sentry from '@sentry/astro'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

const PORT = import.meta.env.PORT ? parseInt(import.meta.env.PORT, 10) : 4321

export default defineConfig({
  integrations: [
    mdx(),
    react(),
    sentry({
      sourceMapsUploadOptions: {
        project: 'alfanjauhari-com-web',
        authToken: import.meta.env.SENTRY_AUTH_TOKEN,
        enabled: false,
      },
      autoInstrumentation: {
        requestHandler: false,
      },
    }),
  ],

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

  site: import.meta.env.PUBLIC_SITE_URL || 'http://localhost:4321',
  output: 'static',
  server: {
    allowedHosts: import.meta.env.NODE_ENV === 'development' ? true : undefined,
    port: PORT,
  },

  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        '/payload/api': {
          target: import.meta.env.PUBLIC_PAYLOAD_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace('/payload', ''),
        },
        '/custom': {
          target: import.meta.env.PUBLIC_PAYLOAD_API_URL,
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
