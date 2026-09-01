# Astro OG image project

This is one Astro project containing three renderer implementations for `@alfanjauhari/astro-og-images`:

- [`src/integrations/og/minimal.ts`](./src/integrations/og/minimal.ts) — a small inline-style element tree.
- [`src/integrations/og/branded.ts`](./src/integrations/og/branded.ts) — a reusable branded card layout.
- [`src/integrations/og/route-aware.ts`](./src/integrations/og/route-aware.ts) — an async renderer using route, type, URL, and image metadata.

`src/integrations/og/render.ts` selects the implementation by pathname, so each page can be previewed from the same Astro app:

- `/minimal`
- `/branded`
- `/route-aware`

Every page uses `getOgImagePath()` from `src/components/Seo.astro`. The metadata format is `webp`, matching the integration configuration.

Run it from the repository root:

```sh
pnpm --filter @alfanjauhari/example-og-image dev
pnpm --filter @alfanjauhari/example-og-image build
```
