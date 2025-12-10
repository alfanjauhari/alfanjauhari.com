# ------------------------------------------------
FROM --platform=$BUILDPLATFORM node:lts-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

# ------------------------------------------------
FROM base AS deps

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,target=/pnpm/store \
  pnpm install --prod --frozen-lockfile

# ------------------------------------------------
FROM base AS builder

ARG VITE_SITE_URL
ENV VITE_SITE_URL=$VITE_SITE_URL

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,target=/pnpm/store \
  pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

# ------------------------------------------------
FROM gcr.io/distroless/nodejs24-debian12 AS runner

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.output ./.output

EXPOSE 3000
CMD [".output/server/index.mjs"]
