# Examples

Two runnable workspace projects for the reusable packages in this repository.

## Projects

- [`og-image`](./og-image) — an Astro project with multiple build-time Open Graph image implementations.
- [`prosemirror`](./prosemirror) — a client-only SolidJS project with multiple editor implementations.

Start either project from the repository root:

```sh
pnpm exec turbo dev --filter=@alfanjauhari/example-og-image
pnpm exec turbo dev --filter=@alfanjauhari/example-prosemirror
```

These commands use the workspace task graph to build package dependencies before starting the example.
