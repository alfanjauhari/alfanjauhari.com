# @alfanjauhari/config

Shared Oxfmt, Oxlint, TypeScript, and Tailwind Typography presets used across the `alfanjauhari.com` monorepo.

The presets intentionally avoid application-specific aliases, generated files, deployment settings, Cloudflare bindings, secrets, and most design tokens. Consumers should extend them with their own project configuration.

## Installation

```sh
pnpm add -D @alfanjauhari/config
```

Install the tools required by the presets you use. Oxfmt and Oxlint are peer dependencies:

```sh
pnpm add -D oxfmt oxlint
```

## Entry Points

There is no package root export. Import one of these subpaths:

| Entry point                                 | Purpose                                             |
| ------------------------------------------- | --------------------------------------------------- |
| `@alfanjauhari/config/oxfmt`                | Oxfmt defaults                                      |
| `@alfanjauhari/config/oxlint`               | Base Oxlint preset                                  |
| `@alfanjauhari/config/oxlint/base`          | Alias of the base Oxlint preset                     |
| `@alfanjauhari/config/oxlint/solid`         | Base Oxlint preset with a Solid-compatible override |
| `@alfanjauhari/config/tsconfig/base`        | Minimal strict TypeScript configuration             |
| `@alfanjauhari/config/tsconfig/astro-solid` | Astro strict configuration for Solid JSX            |
| `@alfanjauhari/config/tailwind-typography`  | Tailwind Typography customizations                  |

## Oxfmt

Create `.oxfmtrc.mjs`:

```js
import config from "@alfanjauhari/config/oxfmt";

export default config;
```

The preset uses ES5-compatible trailing commas and does not ignore any paths. Add project-specific exclusions by extending it:

```js
import config from "@alfanjauhari/config/oxfmt";

export default {
  ...config,
  ignorePatterns: ["dist/**", "worker-configuration.d.ts"],
};
```

## Oxlint

Create `oxlint.config.mts`:

```ts
import config from "@alfanjauhari/config/oxlint";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [config],
});
```

The base preset enables the TypeScript, Unicorn, and Oxc plugins, treats correctness rules as errors, and enables builtin globals.

For Solid projects, use the Solid entry:

```ts
import config from "@alfanjauhari/config/oxlint/solid";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [config],
});
```

The Solid preset currently differs only by disabling `no-unassigned-vars`; it does not enable a Solid-specific plugin or rule set.

## TypeScript

For a general TypeScript project:

```json
{
  "extends": "@alfanjauhari/config/tsconfig/base",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src"]
}
```

The base preset enables `strict` and `skipLibCheck`.

For an Astro project using SolidJS:

```json
{
  "extends": "@alfanjauhari/config/tsconfig/astro-solid",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [".astro/types.d.ts", "src"]
}
```

This preset extends `astro/tsconfigs/strict`, preserves JSX, and uses `solid-js` as the JSX import source. The consuming project must install Astro and SolidJS.

## Tailwind Typography

Create a Tailwind configuration file:

```js
// src/styles/tailwind.config.js
import typography from "@alfanjauhari/config/tailwind-typography";

export default typography;
```

Load it together with Tailwind Typography:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
@config "./tailwind.config.js";
```

The preset customizes the `lg` and `xl` prose sizes. It adjusts image and figure spacing, figure captions, code text selection, and ordered-list markers. Consumers must install Tailwind CSS and `@tailwindcss/typography`, and define a `--foreground` CSS custom property for list marker colors.

## Development

From the monorepo root:

```sh
pnpm --filter @alfanjauhari/config build
pnpm --filter @alfanjauhari/config typecheck
```

Published packages already contain `dist`. Inside this monorepo, build this package before importing a preset from tools that do not participate in the workspace build graph.

This package is licensed under the [MIT License](./LICENSE).
