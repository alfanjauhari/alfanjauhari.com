FROM --platform=$BUILDPLATFORM node:lts-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
COPY . /app

WORKDIR /app

FROM base AS deps

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS builder

ARG VITE_SITE_URL
ENV VITE_SITE_URL=$VITE_SITE_URL

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base AS runner
COPY --from=deps /app/node_modules ./app/node_modules
COPY --from=builder /app/.output /app/.output

EXPOSE 3000

CMD ["pnpm", "start"]
