import { createEnv } from '@t3-oss/env-nextjs'
import z from 'zod'

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['production', 'test', 'development']),
    SENTRY_AUTH_TOKEN: z.string().min(1, 'SENTRY_AUTH_TOKEN is required'),
    SENTRY_DSN: z.string().min(1, 'SENTRY_DSN is required'),
    S3_BUCKET_NAME: z.string().min(1, 'S3_BUCKET_NAME is required'),
    S3_ACCESS_KEY: z.string().min(1, 'S3_ACCESS_KEY is required'),
    S3_SECRET_ACCESS_KEY: z.string().min(1, 'S3_SECRET_ACCESS_KEY is required'),
    S3_REGION: z.string().min(1, 'S3_REGION is required'),
    S3_ENDPOINT: z.string().min(1, 'S3_ENDPOINT is required'),
    PAYLOAD_SECRET: z.string().min(1, 'PAYLOAD_SECRET is required'),
    RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    GITHUB_CLIENT_ID: z.string().min(1, 'GITHUB_CLIENT_ID is required'),
    GITHUB_CLIENT_SECRET: z.string().min(1, 'GITHUB_CLIENT_SECRET is required'),
    GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
    GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required'),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().min(1, 'NEXT_PUBLIC_SITE_URL is required'),
    NEXT_PUBLIC_CDN_URL: z.string().min(1, 'NEXT_PUBLIC_CDN_URL is required'),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,

    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    SENTRY_DSN: process.env.SENTRY_DSN,

    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_CDN_URL: process.env.NEXT_PUBLIC_CDN_URL,

    RESEND_API_KEY: process.env.RESEND_API_KEY,

    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    S3_REGION: process.env.S3_REGION,
    S3_ENDPOINT: process.env.S3_ENDPOINT,

    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,

    DATABASE_URL: process.env.DATABASE_URL,

    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  },
})
