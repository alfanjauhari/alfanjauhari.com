FROM oven/bun:latest AS base
WORKDIR /app

COPY package.json bun.lockb ./
COPY db ./db

FROM base AS prod-deps
RUN bun install --frozen-lockfile --production

FROM base AS installer
RUN bun install --frozen-lockfile

FROM installer AS builder
ENV NODE_ENV=production
COPY . .
RUN --mount=type=secret,id=BUILD_DATABASE_URL,env=DATABASE_URL \
  bun run build

FROM base AS runner
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=base /app/db ./db

ENV HOST=0.0.0.0
ENV PORT=4321

EXPOSE 4321
CMD ["bun", "run", "./dist/server/entry.mjs"]
