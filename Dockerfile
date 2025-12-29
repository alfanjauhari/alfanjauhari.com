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

ARG VITE_SITE_URL CD_CLOUD_NAME VITE_CLOUDINARY_URL BETTER_AUTH_URL

ENV VITE_SITE_URL=$VITE_SITE_URL
ENV CD_CLOUD_NAME=$CD_CLOUD_NAME
ENV VITE_CLOUDINARY_URL=$VITE_CLOUDINARY_URL
ENV BETTER_AUTH_URL=$BETTER_AUTH_URL

# Its required to make env checks happy
ENV APP_DATABASE_URL=XXX
ENV GOOGLE_CLIENT_ID=XXX
ENV GOOGLE_CLIENT_SECRET=XXX
ENV GITHUB_CLIENT_ID=XXX
ENV GITHUB_CLIENT_SECRET=XXX

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,target=/pnpm/store \
  pnpm install --frozen-lockfile

COPY . .

RUN --mount=type=secret,id=CD_API_KEY,env=CD_API_KEY \
  --mount=type=secret,id=CD_API_SECRET,env=CD_API_SECRET \
  --mount=type=secret,id=BETTER_AUTH_SECRET,env=BETTER_AUTH_SECRET \
  pnpm build

RUN pnpm run build:scripts

# ------------------------------------------------
FROM base AS runner

COPY --from=deps --chown=nonroot:nonroot /app/node_modules ./node_modules
COPY --from=builder --chown=nonroot:nonroot /app/.output ./.output
COPY --from=builder --chown=nonroot:nonroot /app/scripts/sync-contents-db.cjs ./scripts/sync-contents-db.cjs
COPY entrypoint.sh /entrypoint.sh

WORKDIR /app/.output

RUN chmod +x /entrypoint.sh

USER nonroot:nonroot

EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]
