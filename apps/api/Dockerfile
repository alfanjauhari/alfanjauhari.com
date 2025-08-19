FROM imbios/bun-node:1.2.19-20-alpine AS base

FROM base AS installer
WORKDIR /app

RUN apk update
RUN bun install --global turbo@2.5.5

COPY . .
RUN turbo prune @alfanjauhari-com/api --docker

FROM base AS builder
WORKDIR /app

COPY --from=installer /app/out/json/ .
RUN bun install --frozen-lockfile

COPY --from=installer /app/out/full/ .
RUN bun turbo run build

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1002 nodejs
RUN adduser --system --uid 1002 nextjs

USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/api/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/api/.next/static ./apps/api/.next/static

CMD ["node", "apps/api/server.js"]