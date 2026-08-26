# alfanjauhari.com

Source for [alfanjauhari.com](https://alfanjauhari.com), a personal portfolio and publishing site, plus the reusable packages developed alongside it.

This is a pnpm and Turborepo monorepo. The website is built with Astro, MDX, SolidJS, and Tailwind CSS, then deployed to Cloudflare. Most pages are prerendered; authentication, feeds, dashboards, comments, and likes use on-demand Cloudflare rendering backed by D1.

## Workspaces

| Workspace                                                         | Description                                              |
| ----------------------------------------------------------------- | -------------------------------------------------------- |
| [`apps/web`](./apps/web)                                          | Private Astro website and Cloudflare Worker              |
| [`@alfanjauhari/astro-og-images`](./packages/astro-og-images)     | Build-time Open Graph images for prerendered Astro pages |
| [`@alfanjauhari/config`](./packages/config)                       | Shared Oxfmt, Oxlint, TypeScript, and Tailwind presets   |
| [`@alfanjauhari/solid-prosemirror`](./packages/solid-prosemirror) | SolidJS rich-text editor built on ProseMirror            |

The website consumes all three packages through `workspace:*`. Packages are built before the application through Turborepo's dependency graph.

## Stack

- Astro 7 with the Cloudflare adapter and MDX content collections
- SolidJS islands for interactive components
- Tailwind CSS 4 and Tailwind Typography
- Cloudflare Workers, D1, Images, Turnstile, and rate-limit bindings
- Drizzle ORM and tracked SQLite migrations
- Better Auth with Google, GitHub, and email magic-link sign-in
- Resend for transactional email
- Takumi for build-time Open Graph image rendering
- pnpm, Turborepo, TypeScript, Oxlint, Oxfmt, Lefthook, and Changesets

## Architecture

Astro uses `output: "static"`, so pages are prerendered by default. Routes that need sessions or database access export `prerender = false` and run through the Cloudflare adapter. These include login, feeds, dashboards, the Better Auth endpoint, and Astro Actions.

Published content lives in Astro content collections:

| Collection | Location                        | Purpose                      |
| ---------- | ------------------------------- | ---------------------------- |
| `updates`  | `apps/web/src/content/updates`  | Long-form writing            |
| `works`    | `apps/web/src/content/works`    | Portfolio case studies       |
| `snippets` | `apps/web/src/content/snippets` | Technical notes and examples |

Interactive features use Astro Actions and SolidJS. D1 stores Better Auth records, short-form feeds, threaded comments, and likes. Public feed HTML is sanitized before rendering.

Open Graph images are generated from prerendered page metadata at the end of every Astro build. Runtime-only routes do not receive generated images.

## Prerequisites

- Node.js 24.19 or newer
- pnpm 11.17.0
- A Cloudflare account and D1 database for dynamic features
- OAuth applications for Google and GitHub
- A Cloudflare Turnstile widget
- A Resend account with `email-login` and `mention` templates

## Getting Started

Install the locked workspace dependencies:

```sh
pnpm install --frozen-lockfile
```

Create `apps/web/.env` with the application configuration:

```dotenv
BETTER_AUTH_URL=http://localhost:4321

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

RESEND_API_TOKEN=your-resend-api-token

CLOUDFLARE_TURNSTILE_SITE_KEY=your-turnstile-site-key
CLOUDFLARE_TURNSTILE_SECRET_KEY=your-turnstile-secret-key

# Optional: comma-separated addresses that can access the admin dashboard.
ADMIN_EMAIL=admin@example.com

# Used by Drizzle's remote D1 tooling.
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
CLOUDFLARE_DATABASE_ID=your-d1-database-id
CLOUDFLARE_D1_TOKEN=your-cloudflare-d1-token
```

Do not commit this file. The deployed Worker must receive equivalent secrets through Cloudflare's environment configuration.

Generate Cloudflare binding types and apply the tracked migrations to the local D1 database:

```sh
pnpm generate-types
pnpm --filter @alfanjauhari/web exec wrangler d1 migrations apply DATABASE --local
```

Start the package watchers and Astro development server:

```sh
pnpm dev
```

The website is available at `http://localhost:4321` by default.

## Environment Variables

| Variable                          | Required             | Purpose                                       |
| --------------------------------- | -------------------- | --------------------------------------------- |
| `BETTER_AUTH_URL`                 | Yes                  | Public base URL used by authentication        |
| `GOOGLE_CLIENT_ID`                | Yes                  | Google OAuth client ID                        |
| `GOOGLE_CLIENT_SECRET`            | Yes                  | Google OAuth client secret                    |
| `GITHUB_CLIENT_ID`                | Yes                  | GitHub OAuth client ID                        |
| `GITHUB_CLIENT_SECRET`            | Yes                  | GitHub OAuth client secret                    |
| `RESEND_API_TOKEN`                | Yes                  | Magic-link and mention email delivery         |
| `CLOUDFLARE_TURNSTILE_SITE_KEY`   | Yes                  | Public Turnstile widget key                   |
| `CLOUDFLARE_TURNSTILE_SECRET_KEY` | Yes                  | Server-side Turnstile verification key        |
| `ADMIN_EMAIL`                     | No                   | Comma-separated administrator email addresses |
| `CLOUDFLARE_ACCOUNT_ID`           | For database tooling | Cloudflare account used by Drizzle            |
| `CLOUDFLARE_DATABASE_ID`          | For database tooling | Remote D1 database used by Drizzle            |
| `CLOUDFLARE_D1_TOKEN`             | For database tooling | API token used by Drizzle                     |
| `REDIS_URL`                       | No                   | Reserved configuration; currently unused      |

At runtime, the Worker expects `DATABASE`, `ASSETS`, `IMAGES`, `LIKE_RATE_LIMITER`, and `MAGIC_LINK_RATE_LIMITER` bindings. Their repository configuration lives in `apps/web/wrangler.jsonc`; account-specific Cloudflare resources still need to be provisioned separately.

## Commands

Run commands from the repository root:

| Command                 | Description                                                                    |
| ----------------------- | ------------------------------------------------------------------------------ |
| `pnpm dev`              | Build internal dependencies, watch packages, and run Astro in development mode |
| `pnpm build`            | Build every workspace through Turborepo                                        |
| `pnpm preview`          | Preview the built website locally                                              |
| `pnpm astro -- <args>`  | Run the Astro CLI for `apps/web`                                               |
| `pnpm typecheck`        | Typecheck the application and packages                                         |
| `pnpm lint`             | Run workspace lint tasks                                                       |
| `pnpm lint:fix`         | Run workspace lint tasks with fixes                                            |
| `pnpm format`           | Build the config package and format the repository                             |
| `pnpm format:check`     | Check formatting without changing files                                        |
| `pnpm generate-types`   | Regenerate Cloudflare Worker binding types                                     |
| `pnpm db:generate`      | Generate a Drizzle migration from schema changes                               |
| `pnpm db:migrate`       | Apply D1 migrations without selecting local or remote explicitly               |
| `pnpm deploy`           | Build and deploy the website with Wrangler                                     |
| `pnpm version-packages` | Apply Changesets package versions                                              |
| `pnpm release`          | Validate and publish versioned packages                                        |

There is currently no automated test suite. Repository validation consists of builds, typechecking, linting, and formatting checks.

## Database Changes

Database schemas are in `apps/web/src/db/schemas`. Generate a migration after changing them:

```sh
pnpm db:generate
```

Generated migrations are committed under `apps/web/drizzle`. Apply them with an explicit target to avoid migrating the wrong database:

```sh
# Local development database
pnpm --filter @alfanjauhari/web exec wrangler d1 migrations apply DATABASE --local

# Configured remote database
pnpm --filter @alfanjauhari/web exec wrangler d1 migrations apply DATABASE --remote
```

## Content Changes

Add an MDX file to the appropriate directory under `apps/web/src/content`. Collection frontmatter is validated by `apps/web/src/content.config.ts`, and dynamic detail routes are generated from collection IDs.

Images and other static files belong in `apps/web/public`. Interactive MDX playgrounds and custom rendering components live under `apps/web/src/components/mdx`.

## Deployment

The website deploys manually to the Worker configured in `apps/web/wrangler.jsonc`:

```sh
pnpm deploy
```

Before deploying, provision the D1 database, Cloudflare Images and rate-limit resources, runtime variables, and secrets in the target Cloudflare account. Apply remote migrations separately; deployment does not run them automatically.

## Package Releases

Public packages use Changesets and are published from `.github/workflows/release.yml` on `main`. The private `@alfanjauhari/web` workspace is excluded from versioning.

Add a changeset for a package-facing change:

```sh
pnpm changeset
```

The release workflow creates or updates a version pull request, validates and packs changed packages, and publishes them when the version changes reach `main`.

## License

Each public package under `packages/` includes its own MIT license. The repository as a whole does not currently declare a single root license.
