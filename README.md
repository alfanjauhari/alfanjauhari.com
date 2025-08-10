# Alfan Jauhari Personal Website

A modern personal website and blog built with Astro (frontend) and PayloadCMS (headless CMS backend). This monorepo contains a full-stack application featuring a blog, authentication system, and admin panel for content management.

## Tech Stack

### Frontend (`apps/web`)

- **Astro** - Static site generator with server-side rendering
- **React** - Component library
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Better Auth** - Authentication system
- **TypeScript** - Type safety

### Backend (`apps/api`)

- **PayloadCMS** - Headless CMS
- **Next.js** - Full-stack React framework
- **PostgreSQL** - Database
- **Better Auth** - Authentication system
- **Resend** - Email service
- **TypeScript** - Type safety

### Infrastructure

- **Turbo** - Monorepo build system
- **Bun** - JavaScript runtime and package manager
- **Biome** - Linting and formatting
- **Sentry** - Error monitoring

## Installation

### Prerequisites

- [Bun](https://bun.sh/) (v1.2.19+)
- [Docker](https://www.docker.com/) (for database)
- [Node.js](https://nodejs.org/) (v18+)

### Local Development

1. Clone the repository:

```bash
git clone https://github.com/alfanjauhari/alfanjauhari.com.git
cd alfanjauhari.com
```

2. Install dependencies:

```bash
bun install
```

3. Start the database (PostgreSQL):

```bash
docker compose up -d alfanjauhari_com_db
```

4. Set up environment variables (see [Environment Variables](#environment-variables) section)

5. Generate database schema and types:

```bash
bun run generate-types
```

6. Start development servers:

```bash
bun run dev
```

This will start:

- Web app: `http://localhost:4321`
- API/Admin: `http://localhost:3000`

## Environment Variables

Create `.env.local` files in both `apps/web` and `apps/api` directories with the following variables:

### Web App (`apps/web/.env.local`)

```env
PUBLIC_PAYLOAD_API_URL=http://localhost:3000
SENTRY_DSN=your_sentry_dsn_here
SENTRY_ORG=your_sentry_org
SENTRY_PROJECT=your_sentry_project
```

### API (`apps/api/.env.local`)

```env
# Database
DATABASE_URL=postgresql://alfanjauhari:alfanjauhari@localhost:5432/alfanjauhari-com

# PayloadCMS
PAYLOAD_SECRET=your_payload_secret_key_here
API_URL=http://localhost:3000

# Email (Resend)
RESEND_API_KEY=your_resend_api_key_here

# Sentry
SENTRY_DSN=your_sentry_dsn_here
SENTRY_ORG=your_sentry_org
SENTRY_PROJECT=your_sentry_project
```

## Scripts

### Root Level

- `bun run dev` - Start all development servers
- `bun run build` - Build all applications
- `bun run clean` - Clean all build artifacts
- `bun run generate-types` - Generate database schema and TypeScript types

### Web App (`apps/web`)

- `bun run dev` - Start Astro development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build

### API (`apps/api`)

- `bun run dev` - Start Next.js development server
- `bun run build` - Build for production
- `bun run generate-types` - Generate PayloadCMS types

## Project Structure

```
alfanjauhari.com/
├── apps/
│   ├── web/                 # Astro frontend
│   │   ├── src/
│   │   │   ├── components/  # React components
│   │   │   ├── content/     # Blog posts and pages
│   │   │   ├── layouts/     # Astro layouts
│   │   │   ├── pages/       # Astro pages
│   │   │   └── styles/      # CSS styles
│   │   └── astro.config.ts
│   └── api/                 # PayloadCMS backend
│       ├── src/
│       │   ├── collections/ # PayloadCMS collections
│       │   ├── libs/        # Utility functions
│       │   └── app/         # Next.js app directory
│       └── payload.config.ts
├── docker-compose.yml       # Docker configuration
├── turbo.json              # Turbo configuration
└── package.json            # Root package.json
```

## Features

- Blog with markdown/MDX support
- Authentication system (login/register)
- Admin panel for content management
- Responsive design with TailwindCSS
- Fast static site generation with Astro
- SEO optimized with meta tags and OG images
- Email notifications via Resend
- Error monitoring with Sentry
