# Solid ProseMirror project

This is a client-only Vite + SolidJS project with three implementations of `@alfanjauhari/solid-prosemirror`:

- [`01-rich-text-editor`](./src/examples/01-rich-text-editor.tsx) — the packaged `RichTextEditor` with default tools.
- [`02-custom-toolbar`](./src/examples/02-custom-toolbar.tsx) — a filtered toolbar plus a custom undo tool.
- [`03-low-level-api`](./src/examples/03-low-level-api.tsx) — direct `createEditor()` usage with a custom toolbar shell.

`src/App.tsx` provides a small client-side picker so all implementations can be tried from one page. No Astro integration or server runtime is required.

Run it from the repository root:

```sh
pnpm --filter @alfanjauhari/example-prosemirror dev
pnpm --filter @alfanjauhari/example-prosemirror build
```

The project uses Tailwind CSS and Tailwind Typography because the packaged editor's shell is styled with those utilities. The ProseMirror stylesheet is imported from `src/main.tsx`.
