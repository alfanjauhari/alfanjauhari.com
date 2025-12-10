FROM --platform=$BUILDPLATFORM node:lts-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# -------------------------------
FROM base AS deps
COPY pnpm-lock.yaml package.json ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
  pnpm install --prod --frozen-lockfile

# -------------------------------
FROM base AS builder
ARG VITE_SITE_URL
ENV VITE_SITE_URL=$VITE_SITE_URL
COPY pnpm-lock.yaml package.json ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
  pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# -------------------------------
FROM base AS runner
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.output ./.output

EXPOSE 3000
CMD ["pnpm", "start"]
