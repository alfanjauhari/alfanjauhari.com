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

ARG VITE_SITE_URL CD_CLOUD_NAME VITE_CLOUDINARY_URL

ENV VITE_SITE_URL=$VITE_SITE_URL
ENV CD_CLOUD_NAME=$CD_CLOUD_NAME
ENV VITE_CLOUDINARY_URL=$VITE_CLOUDINARY_URL

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,target=/pnpm/store \
  pnpm install --frozen-lockfile

COPY . .

RUN --mount=type=secret,id=CD_API_KEY,env=CD_API_KEY \
  --mount=type=secret,id=CD_API_SECRET,env=CD_API_SECRET \
  pnpm run build

# ------------------------------------------------
FROM base AS runner

COPY --from=deps --chown=nonroot:nonroot /app/node_modules ./node_modules
COPY --from=builder --chown=nonroot:nonroot /app/.output ./.output

WORKDIR /app/.output

USER nonroot:nonroot

EXPOSE 3000
CMD ["server/index.mjs"]
