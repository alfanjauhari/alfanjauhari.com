FROM oven/bun:latest AS base
WORKDIR /app

FROM base AS installer
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile --production

FROM installer AS builder
ENV NODE_ENV=production
COPY . .
RUN --mount=type=secret,id=DATABASE_URL,env=DATABASE_URL \
  bun run build

FROM base AS runner
COPY --from=installer /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=4321

EXPOSE 4321
CMD ["bun", "run", "./dist/server/entry.mjs"]
