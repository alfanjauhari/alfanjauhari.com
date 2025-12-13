# Alfan Jauhari

My personal portfolio built as a Full-Stack React application to showcase my professional works, updates and personal information about me.

## Tech Stack

### Core Framework

- TanStack Start
- TanStack Router
- React 19
- Nitro

### Build and Development

- Vite
- TypeScript
- pnpm

### Styling and Animation

- Tailwind CSS V4
- Motion
- Lenis

### Content Management

- Content Collections
- Shiki

### Deployment

- Docker
- Traefik

## Requirements

### System Requirements

- **Node.js**: LTS version (24+)
- **pnpm**: Version 10 or higher
- **Docker** (optional): Version 28+ for containerized development
- **Docker Compose** (optional): Version 2+ for orchestration

### Platform Support

The application is configured to build for Linux platforms with x64 and arm64 architectures

## Installation Guide

### Option 1: Local Development (Recommended)

1. **Clone the repository**

```bash
git clone https://github.com/alfanjauhari/alfanjauhari.com.git
cd alfanjauhari.com
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**
   Create a `.env` file in the project root:

```bash
# .env
VITE_SITE_URL=http://localhost:3000
```

4. **Start the development server**

```bash
pnpm dev
```

This command runs a multi-step build process:

- Compiles MDX content collections
- Generates Open Graph images
- Starts Vite dev server on port 3000

The site will be available at `http://localhost:3000`.

### Option 2: Docker Development Environment

1. **Clone the repository** (same as above)

2. **Create environment file**
   Create a `.env.local` file with required variables:

```bash
VITE_SITE_URL=http://localhost:3000
```

3. **Start Docker containers**

```bash
docker compose -f docker-compose-dev.yml up --build
```

This starts the application with Traefik reverse proxy. Access the site at:

- `http://alfanjauhari.localhost`
- `http://www.alfanjauhari.localhost`

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `pnpm dev`           | Start development server with full build |
| `pnpm build`         | Build for production                     |
| `pnpm start`         | Start production server                  |
| `pnpm build:content` | Compile MDX content only                 |
| `pnpm build:og`      | Generate OG images                       |
| `pnpm check`         | Run formatter and linter                 |
| `pnpm test`          | Run test suite                           |

## Production Deployment

The project includes automated CI/CD via GitHub Actions:

1. **Build**: Creates Docker image with multi-stage build
2. **Push**: Publishes to Docker Hub
3. **Deploy**: SSH deployment to production server with Docker Compose

The production setup includes:

- Traefik reverse proxy with automatic Let's Encrypt SSL certificates
- Cloudflare DNS challenge for certificate validation
- HTTP to HTTPS redirection

## Notes

The project uses a content-driven architecture where MDX files in the `content/` directory are compiled into type-safe collections at build time. This enables static generation of blog posts, portfolio works, and code snippets with full TypeScript support. The routing system is file-based, automatically generating route definitions from the `src/routes/` directory structure.

## License

Please refer to [LICENSE](./LICENSE)
