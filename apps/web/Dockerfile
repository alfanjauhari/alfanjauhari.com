FROM imbios/bun-node:1.2.19-20-alpine AS base

FROM base AS installer
WORKDIR /app

RUN apk update
RUN bun install --global turbo@2.5.5

COPY . .
RUN turbo prune @alfanjauhari-com/web --docker

FROM base AS builder
WORKDIR /app

COPY --from=installer /app/out/json/ .
RUN bun install

ARG PUBLIC_PAYLOAD_API_URL PUBLIC_CDN_URL
ENV PUBLIC_PAYLOAD_API_URL=$PUBLIC_PAYLOAD_API_URL \
  PUBLIC_CDN_URL=$PUBLIC_CDN_URL

COPY --from=installer /app/out/full/ .
RUN bun turbo run build

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1002 nodejs
RUN adduser --system --uid 1002 astro

USER astro

COPY --from=builder --chown=astro:nodejs /app/apps/web/dist ./dist
COPY --from=builder --chown=astro:nodejs /app/apps/web/node_modules ./node_modules

CMD ["node", "apps/web/entry.mjs"]