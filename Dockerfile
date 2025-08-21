FROM imbios/bun-node:1.2.19-20-alpine AS base

FROM base AS deps
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_SITE_URL NEXT_PUBLIC_CDN_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
  NEXT_PUBLIC_CDN_URL=$NEXT_PUBLIC_CDN_URL \
  S3_BUCKET_NAME=XXX \
  S3_REGION=XXX \
  S3_ACCESS_KEY=XXX \
  S3_SECRET_ACCESS_KEY=XXX \
  S3_ENDPOINT=XXX \
  RESEND_API_KEY=XXX \
  SENTRY_AUTH_TOKEN=XXX_ \
  SENTRY_DSN=XXX \
  GITHUB_CLIENT_ID=XXX \
  GITHUB_CLIENT_SECRET=XXX \
  GOOGLE_CLIENT_ID=XXX \
  GOOGLE_CLIENT_SECRET=XXX

RUN --mount=type=secret,id=PAYLOAD_SECRET,env=PAYLOAD_SECRET \
  --mount=type=secret,id=BETTER_AUTH_SECRET,env=BETTER_AUTH_SECRET \
  --mount=type=secret,id=DATABASE_URL,env=DATABASE_URL \
  bun run build

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1002 nodejs
RUN adduser --system --uid 1002 nextjs

USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

CMD ["node", "server.js"]
