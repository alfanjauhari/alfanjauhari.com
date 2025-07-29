import * as Sentry from '@sentry/astro'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  sendDefaultPii: true,
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 1.0,
})
